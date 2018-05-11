var AppDispatcher = require('./dispatcher');
var AppConstants = require('./constants');

// Define actions object
var UserRolesActions = {

	receivePathItems: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.RECEIVE_DATA,
			data: data
		})
	},
	setCurrentPath: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.SET_CURRENT,
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
	setEditingData: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.SET_EDITING_DATA,
			data: data
		})
	},
	saveFile: function() {
		AppDispatcher.handleAction({
			actionType: AppConstants.UPDATE_DATA,
		})
	},
	addPathItem: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.ADD_DATA,
			data: data
		})
	},
	deletePathItems: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.DELETE_DATA,
			data: data
		})
	},
};

module.exports = UserRolesActions;