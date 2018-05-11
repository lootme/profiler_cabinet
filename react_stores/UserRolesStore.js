var AppDispatcher = require('../react_actions/dispatcher');
var AppConstants = require('../react_actions/constants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define initial data points
var _userRoles = [],
	_sortField = 'name',
	_sortOrder = 'ASC',
	_selectedItems = [];

function loadUserRoles(data, callback) {
	fetch('/api/user_role/get_items/', {
		method: 'post',
		body: 'sortBy=' + _sortField + '&orderBy=' + _sortOrder
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log('loadUserRoles completed:', data);
		_userRoles = data;

		callback();
	});
}

function addUserRole(data, callback) {
	fetch('/api/user_role/add_item/', {
		method: 'post',
		body: 'name=' + data.name + '&priority=' + data.priority
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		loadUserRoles(false, callback);
	});
}

function setOrder(order) {
		order = order.split('-');
		_sortField = order[0];
		_sortOrder = order[1].toUpperCase();
}

function setSelected(data) {
		var isSelected = data.isSelected || false,
			itemIndex = _selectedItems.indexOf(data.item);
		if(itemIndex >= 0 && !data.isSelected)
			_selectedItems.splice(itemIndex, 1);
		else if(data.isSelected)
			_selectedItems.push(data.item);
}

function deleteSelected(callback) {
	var data = new FormData();
	data.append("selectedItems", _selectedItems);
	fetch('/api/user_role/delete_items/', {
		method: 'post',
		body: data
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		loadUserRoles(false, callback);
	});
}

// Extend UsersStore with EventEmitter to add eventing capabilities
var UserRolesStore = _.extend({}, EventEmitter.prototype, {

	init: function(items) {
		_userRoles = items;
	},
	
	getUserRoles: function() {
		return _userRoles;
	},
	
	getOrder: function(order) {
		return _sortField + '-' + _sortOrder.toLowerCase();
	},
	
	getSelected: function() {
		return _selectedItems;
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
			loadUserRoles(action.data, function(){
				UserRolesStore.emitChange();
			});
			break;
			
		case AppConstants.ADD_DATA:
			addUserRole(action.data, function(){
				UserRolesStore.emitChange();
			});
			break;
			
		case AppConstants.SET_ORDER:
			setOrder(action.data);
			UserRolesStore.emitChange();
			break;
			
		case AppConstants.SET_SELECTED:
			setSelected(action.data);
			UserRolesStore.emitChange();
			break;
			
		case AppConstants.DELETE_DATA:
			deleteSelected(function(){
				UserRolesStore.emitChange();
			});
			break;

		default:
			return true;
			
	}

	return true;

});

module.exports = UserRolesStore;