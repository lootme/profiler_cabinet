var React = require("react");

// child components
var UserRole = require("./user_roles_item.jsx");
var UserRoleAdd = require("./user_role_add.jsx");
var UserRolesButtons = require("./user_roles_buttons.jsx");

// store & actions
var UserRolesStore = require('../../react_stores/UserRolesStore');
var UserRolesActions = require('../../react_actions/UserRolesActions');

class UserRoles extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userRoles: props.data.userRoles,
			order: 'name-asc',
			selectedItems: []
		};
		
		this._onChange = this._onChange.bind(this);
	}
	
	getStateFromStore() {
		console.log('getStateFromStore called');
		return {
			userRoles: UserRolesStore.getUserRoles(),
			order: UserRolesStore.getOrder(),
			selectedItems: UserRolesStore.getSelected()
		};
	}
	
	componentDidMount() {
		UserRolesStore.init(this.state.userRoles);
		UserRolesStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount() {
		UserRolesStore.removeChangeListener(this._onChange);
	}
	
	_onChange() {
		this.setState(this.getStateFromStore());
		console.log("STATE: ", this.state);
	}
	
	sort() {
		UserRolesActions.receiveUserRoles();
	}
	
	selectSortingOrder(event) {
		if(event.target.value)
			UserRolesActions.setOrder(event.target.value);
	}
	
	addSelected(item, isSelected) {
		UserRolesActions.setSelected({item : item, isSelected : isSelected});
	}
	
  
	render() {
		var userRoles = Object.keys(this.state.userRoles).map((key, index) => {
			return <UserRole key={index} userRoleData={this.state.userRoles[key]} onSelect={this.addSelected} />
		});
		return (
			<div id="tickable">
				<h1>List of user roles here!</h1>
				{<UserRoleAdd />}
				<select onChange={this.selectSortingOrder}>
					<option value=''>Select sorting order</option>
					<option value='name-asc'>Name ascending</option>
					<option value='name-desc'>Name descending</option>
				</select>
				<button onClick={this.sort}>Sort by {this.state.order}</button>
				<table>
					<thead>
						<tr>
							<td>select</td>
							<td>id</td>
							<td>name</td>
							<td>priority</td>
							<td>created at</td>
						</tr>
					</thead>
					<tbody>
					{userRoles}
					</tbody>
				</table>
				<UserRolesButtons />
			</div>
		)
	}
	
}
module.exports = UserRoles;