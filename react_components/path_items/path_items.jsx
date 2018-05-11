var React = require("react");

// child components
var PathItem = require("./path_item.jsx");
var PathItemsEditor = require("./path_items_editor.jsx");
var PathItemsButtons = require("./path_items_buttons.jsx");
var PathItemsGroupButtons = require("./path_items_group_buttons.jsx");

// store & actions
var PathItemsStore = require('../../react_stores/PathItemsStore');
var PathItemsActions = require('../../react_actions/PathItemsActions');

class PathItems extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pathItems: props.data.pathItems,
			currentDir: PathItemsStore.getCurrentDir(),
			openedFileEditingData: PathItemsStore.getFileEditingData(),
			nameEditingData: PathItemsStore.getNameEditingData(),
			selectedItems: PathItemsStore.getSelected()
		};
		
		this._onChange = this._onChange.bind(this);
	}
	
	getStateFromStore() {
		return {
			pathItems: PathItemsStore.getPathItems(),
			currentDir: PathItemsStore.getCurrentDir(),
			openedFileEditingData: PathItemsStore.getFileEditingData(),
			nameEditingData: PathItemsStore.getNameEditingData(),
			selectedItems: PathItemsStore.getSelected()
		};
	}
	
	componentDidMount() {
		PathItemsStore.init(this.props.data.siteSection, this.props.data.root, this.state.pathItems);
		PathItemsStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount() {
		PathItemsStore.removeChangeListener(this._onChange);
	}
	
	_onChange() {
		this.setState(this.getStateFromStore());
		console.log('state changed from store, new state:', this.state);
	}
	
	sort() {
		PathItemsActions.receivePathItems();
	}
	
	selectSortingOrder(event) {
		if(event.target.value)
			PathItemsActions.setOrder(event.target.value);
	}
	
	setCurrentPath(e) {
		if(e.target.dataset.level) {
			PathItemsActions.setCurrentPath({level: e.target.dataset.level});
		} else if(e.target.dataset.path) {
			PathItemsActions.setCurrentPath({dir: e.target.dataset.path});
		} else {
			PathItemsActions.setCurrentPath();
		}
	}
	
	render() {

		var pathItems = (this.state.pathItems.length) ? Object.keys(this.state.pathItems).map((key, index) => {
				var pathItemData = this.state.pathItems[key],
					isSelected = this.state.selectedItems.indexOf(pathItemData.name) >= 0;
				return <PathItem key={index} pathItemData={pathItemData} onChoose={this.setCurrentPath} nameEditingData={this.state.nameEditingData} isSelected={isSelected} />
			})
			:
			<tr><td colSpan="3">The folder is empty.</td></tr>;
			
		if(this.state.currentDir.length) {
			var currentDirItems = Object.keys(this.state.currentDir).map((key, index) => {
				return <span data-level={index+1} onClick={this.setCurrentPath} className='path-breadcrumbs-item'>{this.state.currentDir[key]} /</span>
			});

		}
		return (
			<div>
				<select onChange={this.selectSortingOrder}>
					<option value=''>Select sorting order</option>
					<option value='name-asc'>Name ascending</option>
					<option value='name-desc'>Name descending</option>
				</select>
				<button onClick={this.sort}>Sort by {this.state.order}</button>
				<div className="path-breadcrumbs">
					<span data-level='0' onClick={this.setCurrentPath} className='path-breadcrumbs-item'>root /</span>
					{currentDirItems}
				</div>
				<PathItemsButtons />
				<table>
					<tbody>
					{this.state.currentDir.length > 0 &&
							<tr>
								<td></td>
								<td><span onClick={this.setCurrentPath} className='path-item'>...</span></td>
								<td></td>
							</tr>
					}
					{pathItems}
					</tbody>
				</table>
				<PathItemsGroupButtons />
				{this.state.openedFileEditingData.name !== false && this.state.openedFileEditingData.content !== false &&
					<PathItemsEditor fileData={this.state.openedFileEditingData} onCancel={this.setCurrentPath} />
				}
			</div>
		)
	}
	
}
module.exports = PathItems;