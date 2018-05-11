var React = require("react");
var PathItemsActions = require('../../react_actions/PathItemsActions');

class PathItemsGroupButtons extends React.Component {

	constructor(props) {
		super(props);
	}
  
	delete(e) {
		PathItemsActions.deletePathItems();
	}
  
	render() {
		return (
			<div className="path-items-control-buttons">
				<button onClick={this.delete}>Delete</button>
			</div>
		)
	}
	
}

module.exports = PathItemsGroupButtons;