var React = require("react");
var PathItemsActions = require('../../react_actions/PathItemsActions');

class PathItemEditor extends React.Component {

	constructor(props) {
		super(props);
	}
	
	setEditing(e) {
		PathItemsActions.setEditingData({
			[e.target.name] : e.target.value,
		});
	}
	
	saveFile(e) {
		PathItemsActions.saveFile();
	}
	
	render() {
		return (
				<div className="path-items-editor">
					<div>
						<label>Enter file name</label>
						<input onChange={this.setEditing} name='name' value={this.props.fileData.name} />
					</div>
					<textarea onChange={this.setEditing} name="content">{this.props.fileData.content}</textarea>
					<div className="path-items-editor-buttons">
						<button onClick={this.saveFile}>Save file</button>
						<button onClick={this.props.onCancel}>Cancel</button>
					</div>
				</div>
		)
	}
	
}

module.exports = PathItemEditor;