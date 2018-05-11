var React = require("react");
var User = require("./users_item.jsx");
var UsersStore = require('../../react_stores/UsersStore');
var UsersActions = require('../../react_actions/UsersActions');

class Users extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			//users: UsersActions.receiveUsers
			users: props.data.users,
			order: 'username-asc'
		};
		
		this._onChange = this._onChange.bind(this);
	}
	
	getStateFromStore() {
		console.log('getStateFromStore called');
		return {
			users: UsersStore.getUsers(),
			order: UsersStore.getOrder(),
		};
	}
	
	componentDidMount() {
		UsersStore.init(this.state.users);
		UsersStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount() {
		UsersStore.removeChangeListener(this._onChange);
	}
	
	_onChange() {
		this.setState(this.getStateFromStore());
	}
	
	sort() {
		UsersActions.receiveUsers();
	}
	
	selectSortingOrder(event) {
		if(event.target.value)
			UsersActions.setOrder(event.target.value);
	}
	
  
	render() {
		var users = Object.keys(this.state.users).map((key, index) => {
			return <User key={index} userData={this.state.users[key]} />
		});
		return (
			<div id="tickable">
				<h1>List of users here!</h1>
				<select onChange={this.selectSortingOrder}>
					<option value=''>Select sorting order</option>
					<option value='username-asc'>Name ascending</option>
					<option value='username-desc'>Name descending</option>
				</select>
				<button onClick={this.sort}>Sort by {this.state.order}</button>
				<table>
					<thead>
						<tr>
							<td>id</td>
							<td>name</td>
							<td>created at</td>
						</tr>
					</thead>
					<tbody>
					{users}
					</tbody>
				</table>
			</div>
		)
	}
	
}
module.exports = Users;