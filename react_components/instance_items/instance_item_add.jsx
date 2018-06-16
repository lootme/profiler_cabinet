var React = require("react");
var InstanceItemsActions = require('../../react_actions/InstanceItemsActions');

class InstanceItemAdd extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		Object.keys(props.fields).map((key, index) => {
			if(this.props.fields[key]) {
				var isPlural = this.props.fields[key].plural,
					defaultValue = this.props.fields[key].default_value;
				this.state[props.fields[key].code] = defaultValue ? defaultValue : (isPlural ? [] : '');
			} else {
				delete this.props.fields[key];
			}
		});
		this.add = this.add.bind(this);
		this.handlePluralOption = this.handlePluralOption.bind(this);
	}
	
	componentDidMount() {
		
	}

	add(e) {
		e.preventDefault();

		InstanceItemsActions.addInstanceItem({state : this.state, props : this.props});
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
				label = this.props.fields[key].label ? this.props.fields[key].label : code,
				placeholder = "Enter " + label,
				isPlural = this.props.fields[key].plural,
				isHidden = this.props.fields[key].hide;
			
			if(enumValues) {
			
				// enum type
				if(isPlural) {
					// checkboxes
					return(
						<div className="form-instance-add-field" data-hidden={isHidden}>
							{
								enumValues.map((enumValue) => {
									var checked = this.state[code] && this.state[code].indexOf(enumValue.value) >= 0 ? "checked" : false;
									
									return (
										<div>
											<input type="checkbox" name={code} value={enumValue.value} onChange={this.handlePluralOption} checked={checked}/>
											<label>{enumValue.name}</label>
										</div>
									)
								})
							}
						</div>
					)
				} else {
					// select
					var options = Object.keys(enumValues).map((key, index) => {
						var selected = this.state[code] && this.state[code] == enumValues[key].value ? 'selected' : false;
						return <option value={enumValues[key].value} selected={selected}>{enumValues[key].name}</option>
					});
					return (
						<div className="form-instance-add-field" data-hidden={isHidden}>
							<select name={code} onChange={ (e) => this.setState({ [e.target.name] : e.target.value }) }>
								<option value="">Select {code}</option>
								{options}
							</select>
						</div>
					)
				}
				
			} else {
			
				// string type
				return (
					<div className="form-instance-add-field" data-hidden={isHidden}>
						<label>{label}</label>
						<input type="text" name={code} className="form-instance-add-field" onChange={ (e) => this.setState({ [e.target.name]: e.target.value }) } placeholder={placeholder} value={this.state[code]} />
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