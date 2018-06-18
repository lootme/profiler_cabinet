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
		var stateFromStore = {};
		if(!this.props.data.addMode) {
			stateFromStore.instanceItems = InstanceItemsStore.getInstanceItems();
			stateFromStore.order = InstanceItemsStore.getOrder();
		}
		if(!this.props.data.viewMode) {
			stateFromStore.selectedItems = InstanceItemsStore.getSelected();
			stateFromStore.editingData = InstanceItemsStore.getEditingData();
		}
			
		return stateFromStore;
	}
	
	componentDidMount() {
		if(!this.props.data.addMode) {
			InstanceItemsStore.init(
				this.props.data.instanceName,
				this.state.instanceItems,
				this.props.data.filter,
				this.props.data.groupBy
			);
		}
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
		var renderInstanceItems = (items, groupId) => {
			// TODO move all calculations to backend
			var itemsCount = 0,
				itemsAvg = 0,
				itemsSumm = 0;
			var instanceItems = Object.keys(items).map((key, index) => {
				var editingData = this.state.editingData &&
										this.state.editingData.id == this.state.instanceItems[key].id ? 
											this.state.editingData : false;
				itemsCount++;
				if(this.props.data.groupAvg) {
					itemsAvg += parseFloat(items[key][this.props.data.groupAvg]);
				}
				if(this.props.data.groupSumm) {
					itemsSumm += parseFloat(items[key][this.props.data.groupSumm]);
				}
				return <InstanceItem
						key={index}
						instanceItemData={items[key]}
						fields={this.props.data.fields}
						viewMode={this.props.data.viewMode}
						hasDetail={this.props.data.hasDetail}
						editingData={editingData}
					/>
			});
			itemsAvg = (this.props.data.groupAvg) ? ' (' + itemsAvg/itemsCount + ')' : '';
			itemsSumm = (this.props.data.groupSumm) ? ' (' + itemsSumm + ')' : '';
			return !groupId ?
				instanceItems :
				<div className="instance-data-body-row-group">
					<div className="instance-data-body-row group-id">{groupId} (count: {itemsCount}){itemsAvg}{itemsSumm}</div>
					{instanceItems}
				</div>
		}
		var isHidden = false;

		if(!this.props.data.addMode && Object.keys(this.state.instanceItems).length) {
			var instanceItems,
				headersItem = false;
			if(this.props.data.groupBy) {
				instanceItems = Object.keys(this.state.instanceItems).map((groupId, index) => {
					if(!headers) {
						headers = Object.keys(this.state.instanceItems[groupId][0]);
					}

					return renderInstanceItems(this.state.instanceItems[groupId], groupId)
				});
			} else {
				instanceItems = renderInstanceItems(this.state.instanceItems);
				headers = Object.keys(this.state.instanceItems[0]);
			}

			var label,
				isHidden;
			var headers = headers.filter(propertyCode => {
				isHidden = false;
				this.props.data.fields.forEach((field) => { // each field
					if(!isHidden) {
						isHidden = propertyCode == 'detailLink' || (field.code == propertyCode && field.hide);
					}
				});
				return !isHidden;
			}).map((propertyCode, index) => {
					
				label = propertyCode;

				this.props.data.fields.forEach((field) => { // each field
					if(field.code == propertyCode && field.label) {
						label = field.label;
					}
				});
				
				return  <div className="instance-data-head-row-cell">{label}</div>;
			});
		}
		
		var addForm = (!this.props.data.viewMode) ? <InstanceItemAdd fields={this.props.data.fields} /> : '',
			buttons = (!this.props.data.viewMode) ? <InstanceItemsButtons /> : '';
		
		if(this.props.data.addMode) {
			return addForm;
		} else {
			return (
				<div>
					<h2 className="sub-heading">List of {this.props.data.title} here!</h2>
					<div class="errors-holder"></div>
					{addForm}
					{this.state.instanceItems ? (
						<div>
							<select onChange={this.selectSortingOrder}>
								<option value=''>Select sorting order</option>
								<option value='name-asc'>Name ascending</option>
								<option value='name-desc'>Name descending</option>
							</select>
							<button onClick={this.sort}>Sort by {this.state.order}</button>
							<div className="instance-data">
								<div className="instance-data-head">
									<div className="instance-data-head-row">
										{!this.props.data.viewMode && <div className="instance-data-head-row-cell"></div>}
										{headers}
										{!this.props.data.viewMode && <div className="instance-data-head-row-cell"></div>}
									</div>
								</div>
								<div className="instance-data-body">
								{instanceItems}
								</div>
							</div>
							{buttons}
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