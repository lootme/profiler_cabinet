var React = require("react");
var Checkpoint = require("./checkpoints_item.jsx");

class Checkpoints extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			checkpoints: props.data.checkpoints,
			order: 'username-asc'
		};
		
		this._onChange = this._onChange.bind(this);
	}
	
	getStateFromStore() {
		return;
		return {
			users: UsersStore.getUsers(),
			order: UsersStore.getOrder(),
		};
	}
	
	componentDidMount() {
		return;
		UsersStore.init(this.state.users);
		UsersStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount() {
		return;
		UsersStore.removeChangeListener(this._onChange);
	}
	
	_onChange() {
		return;
		this.setState(this.getStateFromStore());
	}
	
	sort() {
		return;
		UsersActions.receiveUsers();
	}
	
	selectSortingOrder(event) {
		if(event.target.value)
			UsersActions.setOrder(event.target.value);
	}
	
  
	render() {
		var checkpoints = Object.keys(this.state.checkpoints).map((key, index) => {
			return <Checkpoint key={index} checkpointData={this.state.checkpoints[key]} />
		});
		return (
			<div className="checkpoints-table">
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
					{checkpoints}
					</tbody>
				</table>
			</div>
		)
	}
	
}
module.exports = Checkpoints;