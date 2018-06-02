var React = require("react");

// child components
var InstanceItem = require("./instance_item.jsx");
var InstanceItemAdd = require("./instance_item_add.jsx");
var InstanceItemsButtons = require("./instance_items_buttons.jsx");

// store & actions
var InstanceItemsStore = require('../../react_stores/InstanceItemsStore');
var InstanceItemsActions = require('../../react_actions/InstanceItemsActions');

class InstanceItems extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			instanceItems: props.data.instanceItems,
			order: 'name-asc',
			selectedItems: [],
			editingData: false
		};
		
		this._onChange = this._onChange.bind(this);
	}
	
	getStateFromStore() {
		return {
			instanceItems: InstanceItemsStore.getInstanceItems(),
			order: InstanceItemsStore.getOrder(),
			selectedItems: InstanceItemsStore.getSelected(),
			editingData: InstanceItemsStore.getEditingData()
		};
	}
	
	componentDidMount() {
		InstanceItemsStore.init(this.props.data.instanceName, this.state.instanceItems);
		InstanceItemsStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount() {
		InstanceItemsStore.removeChangeListener(this._onChange);
	}
	
	_onChange() {
		this.setState(this.getStateFromStore());
	}
	
	sort() {
		InstanceItemsActions.receiveInstanceItems();
	}
	
	selectSortingOrder(event) {
		if(event.target.value)
			InstanceItemsActions.setOrder(event.target.value);
	}
	
	
	saveEdited() {
		InstanceItemsActions.updateInstanceItem();
	}
	
	render() {
		var isHidden = false;
		if(!this.props.data.addMode && this.state.instanceItems.length) {
			var instanceItems = Object.keys(this.state.instanceItems).map((key, index) => {
				var editingData = this.state.editingData &&
										this.state.editingData.id == this.state.instanceItems[key].id ? 
											this.state.editingData : false;
				return <InstanceItem key={index} instanceItemData={this.state.instanceItems[key]} fields={this.props.data.fields} editingData={editingData} />
			});
			var headers = Object.keys(this.state.instanceItems[0]).map((key, index) => {
				this.props.data.fields.forEach((field) => { // each field
					if(field.code == key && field.hide) {
							isHidden = true;
					}
				});
				if(isHidden) {
					return;
				}
				
				return <td>{key}</td>
			});
		}
		
		if(this.props.data.addMode) {
			return <InstanceItemAdd fields={this.props.data.fields} />
		} else {
			return (
				<div>
					<h2 className="sub-heading">List of {this.props.data.title} here!</h2>
					{<InstanceItemAdd fields={this.props.data.fields} />}
					{this.state.instanceItems ? (
						<div>
							<select onChange={this.selectSortingOrder}>
								<option value=''>Select sorting order</option>
								<option value='name-asc'>Name ascending</option>
								<option value='name-desc'>Name descending</option>
							</select>
							<button onClick={this.sort}>Sort by {this.state.order}</button>
							<table>
								<thead>
									<tr>
										<td></td>
										{headers}
										<td></td>
									</tr>
								</thead>
								<tbody>
								{instanceItems}
								</tbody>
							</table>
							<InstanceItemsButtons />
						</div>
					) : (
						<div>{this.props.data.title} are not found!</div>
					)}
				</div>
			)
		}
	}
	
}
module.exports = InstanceItems;