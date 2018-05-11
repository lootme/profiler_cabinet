var React = require("react");
var UserRolesActions = require('../../react_actions/UserRolesActions');

class UserRolesButtons extends React.Component {

	constructor(props) {
		super(props);
	}
  
	delete(e) {
		UserRolesActions.deleteUserRoles();
	}
  
	render() {
		return (
				<button onClick={this.delete}>Delete</button>
		)
	}
	
}

module.exports = UserRolesButtons;