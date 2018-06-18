var React = require("react");
var InstanceItemsActions = require('../../react_actions/InstanceItemsActions');

class InstanceItem extends React.Component {

	constructor(props) {
		super(props);
		
		this.setEditingData = this.setEditingData.bind(this);
	}
	
	addSelected(e) {
		InstanceItemsActions.setSelected({item : e.target.value, isSelected : e.target.checked});
	}
	
	saveEdited() {
		InstanceItemsActions.updateInstanceItem();
	}
	
	setEditingData(e) {
		InstanceItemsActions.setEditingData({
			id : this.props.instanceItemData.id,
			code : e.target.name,
			value : e.target.value,
			checked : e.target.checked,
			isPlural : e.target.dataset.plural
		});
	}
	
	render() {
		if(this.props.editingData) {
			var inputs = {};
			Object.keys(this.props.fields).map((key, index) => {
				var code = this.props.fields[key].code,
					enumValues = this.props.fields[key].values,
					placeholder = "Enter " + code,
					editingValue = this.props.editingData[code],
					isPlural = this.props.fields[key].plural,
					isHidden = this.props.fields[key].hide;
					
				if(isHidden) {
					return;
				}
					
				if(enumValues) {
				
					// enum type
					if(isPlural) {
						// checkboxes
						inputs[code] = (
							<div>
								{
									enumValues.map((enumValue) => {
										var checked = editingValue.indexOf(enumValue.value) >= 0 ? "checked" : false,
											checkboxId = 'check-control-' + code;
										
										return (
											<span>
												<input id="{checkboxId}" type="checkbox" data-plural={isPlural} name={code} value={enumValue.value} onChange={this.setEditingData} checked={checked}/>
												<label htmlFor={checkboxId}>{enumValue.name}</label>
											</span>
										)
									})
								}
							</div>
						)
					} else {
						// select
						inputs[code] = (
							<select name={code} onChange={this.setEditingData}>
								<option value="">Select {code}</option>
								{
									enumValues.map((enumValue) => {
										var selected = editingValue == enumValue.value ? 'selected' : false;
										return <option value={enumValue.value} selected={selected}>{enumValue.name}</option>
									})
								}
							</select>
						)
					}
					
				} else {
				
					// string type
					inputs[code] = (
						<input type="text" name={code} value={editingValue} onChange={this.setEditingData} placeholder={placeholder} />
					)
					
				}
			});
		}
		var cells = Object.keys(this.props.instanceItemData).map((key, index) => { // each property
			var cell,
				isHidden = false;
				
			this.props.fields.forEach((field) => { // each field
				if(key == 'detailLink' || (field.code == key && field.hide)) {
						isHidden = true;
				}
			});
			if(isHidden) {
				return;
			}

			if(this.props.editingData && inputs[key]) {
			
				// edit mode
				cell = inputs[key];
				
			} else if(this.props.instanceItemData[key] && typeof(this.props.instanceItemData[key]) == 'object') {
			
				// no edit mode
				
				cell = [];
				this.props.fields.forEach((field) => { // each field
					if(field.code == key) {
						if(field.values) {
							//type - plural
							field.values.forEach((fieldValue) => { // each field value
								var foundIndex = this.props.instanceItemData[key].indexOf(fieldValue.value);
								if(foundIndex >= 0) {
									cell.push(fieldValue.name);
								}
							});
						} else {
							// type - json
							cell.push(JSON.stringify(field));
						}
					}
				});
				cell = cell.join(', ');
				
			} else {
			
				// no edit mode, type - single
				cell = (key == 'id' && this.props.instanceItemData.detailLink) ? 
					<a href={this.props.instanceItemData.detailLink}>{this.props.instanceItemData[key]}</a> :
					this.props.instanceItemData[key];
				
			}
			return (
				<div className={this.props.cellClass}>{cell}</div>
			)
		});
		if(!this.props.viewMode) {
			cells.push(<div className={this.props.cellClass}><button onClick={this.props.editingData ? this.saveEdited : this.setEditingData}>{this.props.editingData ? 'Save' : 'Edit'}</button></div>);
		}
		return (
				<div className={this.props.rowClass}>
					{!this.props.viewMode &&
						<div className={this.props.cellClass}><input type="checkbox" value={this.props.instanceItemData.id} onChange={this.addSelected} /></div>
					}
					{cells}
				</div>
		)
	}
	
}

module.exports = InstanceItem;