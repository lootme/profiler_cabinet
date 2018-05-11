var React = require("react");
class User extends React.Component {

	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}
  
	render() {
		return (
				<tr>
					<td>{this.props.userData.id}</td>
					<td>{this.props.userData.username}</td>
					<td>{this.props.userData.createdAt}</td>
				</tr>
		)
	}
	
}

module.exports = User;