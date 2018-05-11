var React = require("react");
var InstanceItemsActions = require('../../react_actions/InstanceItemsActions');

class InstanceItemsButtons extends React.Component {

	constructor(props) {
		super(props);
	}
  
	delete(e) {
		InstanceItemsActions.deleteInstanceItems();
	}
  
	render() {
		return (
			<div className="instance-control-buttons">
				<button onClick={this.delete}>Delete</button>
			</div>
		)
	}
	
}

module.exports = InstanceItemsButtons;