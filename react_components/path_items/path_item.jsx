var React = require("react");
var PathItemsActions = require('../../react_actions/PathItemsActions');

class PathItem extends React.Component {

	constructor(props) {
		super(props);
	}
	
	addSelected(e) {
		PathItemsActions.setSelected({item : e.target.value, isSelected : e.target.checked});
	}
	
	setEditing(e) {
		if(typeof(e.target.dataset.path) == 'string') {
			PathItemsActions.setEditingData(e.target.dataset.path ? {oldPath: e.target.dataset.path} : false);
		} else {
			PathItemsActions.setEditingData({newPath: e.target.value});
		}
	}
	
	delete(e) {
		PathItemsActions.deletePathItems(e.target.dataset.path);
	}
	
	render() {
		
		var pathItemData = this.props.pathItemData,
			isRenaming = this.props.nameEditingData.oldPath == pathItemData.name,
			checked = this.props.isSelected || false;

		return (
				<tr>
					<td><input type="checkbox" value={pathItemData.name} onChange={this.addSelected} checked={checked} /></td>
					<td>
						{isRenaming ?
							(<input type='text' value={this.props.nameEditingData.newPath} onChange={this.setEditing} />)
							:
							(<span data-path={pathItemData.name} onClick={this.props.onChoose} className={'path-item type-' + pathItemData.type}>{pathItemData.name}</span>)
						}
					</td>
					<td>
						<button data-path={isRenaming ? '' : pathItemData.name} onClick={this.setEditing}>{isRenaming ? 'Apply' : 'Rename'}</button>
						<button data-path={pathItemData.name} onClick={this.delete}>Delete</button>
					</td>
				</tr>
		)
	}
	
}

module.exports = PathItem;