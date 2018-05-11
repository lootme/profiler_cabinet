var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var AppDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
AppDispatcher.handleAction = function(action) {
	var action = action || false,
		dispatchData = {source: 'VIEW_ACTION'};
	if(!!action)
		dispatchData.action = action;
	this.dispatch(dispatchData);
}

module.exports = AppDispatcher;