var AppDispatcher = require('./dispatcher');
var AppConstants = require('./constants');

// Define actions object
var UsersActions = {

  receiveUsers: function(data) {
    AppDispatcher.handleAction({
      actionType: AppConstants.RECEIVE_DATA,
      data: data
    })
  },
  setOrder: function(data) {
    AppDispatcher.handleAction({
      actionType: AppConstants.SET_ORDER,
      data: data
    })
  },

};

module.exports = UsersActions;