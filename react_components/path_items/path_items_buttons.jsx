var React = require("react");
var PathItemsActions = require('../../react_actions/PathItemsActions');

class PathItemsButtons extends React.Component {

	constructor(props) {
		super(props);
	}
	
	addSelected(e) {
		PathItemsActions.setSelected({item : e.target.value, isSelected : e.target.checked});
	}
	
	add(e) {
		PathItemsActions.addPathItem(e.target.dataset.type);
	}
	
	render() {
		
		var pathItemData = this.props.pathItemData;
		return (
				<div className='path-items-buttons'>
					<button onClick={this.add} data-type='d' className='path-items-buttons-item'>Add directory</button>
					<button onClick={this.add} data-type='f' className='path-items-buttons-item'>Add page</button>
				</div>
		)
	}
	
}

module.exports = PathItemsButtons;