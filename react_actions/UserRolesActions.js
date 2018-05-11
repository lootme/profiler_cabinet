var AppDispatcher = require('./dispatcher');
var AppConstants = require('./constants');

// Define actions object
var UserRolesActions = {

	receiveUserRoles: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.RECEIVE_DATA,
			data: data
		})
	},
	addUserRole: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.ADD_DATA,
			data: data
		})
	},
	setOrder: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.SET_ORDER,
			data: data
		})
	},
	setSelected: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.SET_SELECTED,
			data: data
		})
	},
	deleteUserRoles: function() {
		AppDispatcher.handleAction({
			actionType: AppConstants.DELETE_DATA,
		})
	},

};

module.exports = UserRolesActions;