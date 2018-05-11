var React = require("react");
class UserRole extends React.Component {

	constructor(props) {
		super(props);
		
		this.addSelected = this.addSelected.bind(this);
	}
  
	addSelected(e) {
		this.props.onSelect(e.target.value, e.target.checked);
	}
  
	render() {
		return (
				<tr>
					<td><input type="checkbox" value={this.props.userRoleData.id} onChange={this.addSelected} /></td>
					<td>{this.props.userRoleData.id}</td>
					<td>{this.props.userRoleData.name}</td>
					<td>{this.props.userRoleData.priority}</td>
					<td>{this.props.userRoleData.createdAt}</td>
				</tr>
		)
	}
	
}

module.exports = UserRole;