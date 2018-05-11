var React = require("react");
var UserRolesActions = require('../../react_actions/UserRolesActions');

class UserRoleAdd extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			priority: ''
		};
		
		this.add = this.add.bind(this);
	}

	add(e) {
		e.preventDefault();

		UserRolesActions.addUserRole(this.state);
	}
	
	render() {
		var priorityOptions = [];
		for(var i = 1; i <= 10; i++)
			priorityOptions.push(i);
		return (
				<form onSubmit={this.add}>
					<input type="text" name="name" onChange={ (e) => this.setState({ name: e.target.value }) } /><br />
					<select name="priority" onChange={ (e) => this.setState({ priority: e.target.value }) } placeholder="Enter role name">
						<option value="">Select role priority</option>
						{
							priorityOptions.map((priorityOption) =>
							  <option value={priorityOption}>{priorityOption}</option>
							)
						}
					</select><br />
					<input type="submit" name="user_role_submit" value="Add" />
				</form>
		)
	}
	
}

module.exports = UserRoleAdd;