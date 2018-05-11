var keyMirror = require('keymirror');

// Define action constants
module.exports = keyMirror({
	RECEIVE_DATA: null,
	ADD_DATA : null,
	SET_ORDER: null,
	SET_SELECTED: null,
	DELETE_DATA : null,
	SET_EDITING_DATA : null,
	UPDATE_DATA : null,
	SET_CURRENT : null
});