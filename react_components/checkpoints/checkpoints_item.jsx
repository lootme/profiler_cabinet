var React = require("react");
class Checkpoint extends React.Component {

	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}
  
	render() {
		return (
				<tr>
					<td>{this.props.checkpointData.name}</td>
					<td>{this.props.checkpointData.name}</td>
					<td>{this.props.checkpointData.value}</td>
				</tr>
		)
	}
	
}

module.exports = Checkpoint;