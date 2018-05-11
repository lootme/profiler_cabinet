var AppDispatcher = require('./dispatcher');
var AppConstants = require('./constants');

// Define actions object
var InstanceItemsActions = {

	receiveInstanceItems: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.RECEIVE_DATA,
			data: data
		})
	},
	addInstanceItem: function(data) {
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
	deleteInstanceItems: function() {
		AppDispatcher.handleAction({
			actionType: AppConstants.DELETE_DATA,
		})
	},
	setEditingData: function(data) {
		AppDispatcher.handleAction({
			actionType: AppConstants.SET_EDITING_DATA,
			data: data
		})
	},
	updateInstanceItem: function() {
		AppDispatcher.handleAction({
			actionType: AppConstants.UPDATE_DATA,
		})
	},

};

module.exports = InstanceItemsActions;