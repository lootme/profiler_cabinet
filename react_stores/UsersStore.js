var AppDispatcher = require('../react_actions/dispatcher');
var AppConstants = require('../react_actions/constants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define initial data points
var _users = [],
	_sortField = 'username',
	_sortOrder = 'ASC';

// Method to load product data from mock API
function loadUsers(data, callback) {
	fetch('/api/user/get_items/', {
		method: 'post',
		body: 'sortBy=' + _sortField + '&orderBy=' + _sortOrder
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log('loadUsers completed:', data);
		_users = data;

		callback();
	});
}

function setOrder(order) {
		order = order.split('-');
		_sortField = order[0];
		_sortOrder = order[1].toUpperCase();
}


// Extend UsersStore with EventEmitter to add eventing capabilities
var UsersStore = _.extend({}, EventEmitter.prototype, {

	init: function(items) {
		_users = items;
	},
	
	getUsers: function() {
		return _users;
	},
	
	getOrder: function(order) {
		return _sortField + '-' + _sortOrder.toLowerCase();
	},

	// Emit Change event
	emitChange: function() {
		this.emit('change');
	},


	// Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}

});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
	var action = payload.action;
	var text;

	switch(action.actionType) {

		case AppConstants.RECEIVE_DATA:
			loadUsers(action.data, function(){
				UsersStore.emitChange();
			});
			break;
			
		case AppConstants.SET_ORDER:
			setOrder(action.data);
			UsersStore.emitChange();
			break;

		default:
			return true;
			
	}

	return true;

});

module.exports = UsersStore;