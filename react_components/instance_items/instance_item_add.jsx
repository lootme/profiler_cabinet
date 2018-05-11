var React = require("react");
var InstanceItemsActions = require('../../react_actions/InstanceItemsActions');

class InstanceItemAdd extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		
		Object.keys(props.fields).map((key, index) => {
			var isPlural = this.props.fields[key].plural;
			this.state[props.fields[key].code] = isPlural ? [] : '';
		});
		
		this.add = this.add.bind(this);
		this.handlePluralOption = this.handlePluralOption.bind(this);
	}

	add(e) {
		e.preventDefault();

		InstanceItemsActions.addInstanceItem(this.state);
	}
	
	handlePluralOption(e) {
		var code = e.target.name,
			value = e.target.value,
			state = this.state[code],
			index = state.indexOf(value);
			
		if(index < 0) {
			state.push(value);
		} else {
			state.splice(index, 1);
		}
		
		this.setState({[code] : state});
	}
	
	render() {
		var inputs = Object.keys(this.props.fields).map((key, index) => {
			
			var code = this.props.fields[key].code,
				enumValues = this.props.fields[key].values,
				placeholder = "Enter " + code,
				isPlural = this.props.fields[key].plural;
				
			
			if(enumValues) {
			
				// enum type
				if(isPlural) {
					// checkboxes
					return(
						<div className="form-instance-add-field">
							{
								enumValues.map((priorityOption) => {
									return (
										<div>
											<input type="checkbox" name={code} value={priorityOption.value} onChange={this.handlePluralOption}/>
											<label>{priorityOption.name}</label>
										</div>
									)
								})
							}
						</div>
					)
				} else {
					// select
					return (
						<div className="form-instance-add-field">
							<select name={code} onChange={ (e) => this.setState({ [e.target.name] : e.target.value }) }>
								<option value="">Select {code}</option>
								{
									enumValues.map((priorityOption) =>
									  <option value={priorityOption.value}>{priorityOption.name}</option>
									)
								}
							</select>
						</div>
					)
				}
				
			} else {
			
				// string type
				return (
					<div className="form-instance-add-field">
						<input type="text" name={code} className="form-instance-add-field" onChange={ (e) => this.setState({ [e.target.name]: e.target.value }) } placeholder={placeholder} />
					</div>
				)
				
			}
		});
		return (
				<form onSubmit={this.add} className="form-instance-add">
					{inputs}
					<input type="submit" name="instance_item_submit" value="Add" />
				</form>
		)
	}
	
}

module.exports = InstanceItemAdd;