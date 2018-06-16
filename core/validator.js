/*
	Available options to check:
	- required
	- noZero (only for integers)
	- positive (only for integers or floats)
	- negative (only for integers or floats)
	- inValues (only for integers, you should also pass 'values' as param with array of values)
*/
module.exports = () => {
	
	var messages = {
		'required' : '#FIELD# is required',
		'noZero' : '#FIELD# cannot be zero',
		'positive' : '#FIELD# should be positive',
		'negative' : '#FIELD# should be negative',
		'inValues' : '#FIELD# should be in values (#VALUES#)',
	};

	return {

		check : (params, fields) => {
			
			var fieldParams,
				fieldData,
				value,
				errors = [];
				
			var addError = (errorCode, fieldName, values) => {
				var values = values || false,
					message = messages[errorCode].replace("#FIELD#", fieldName);
					
				if(values && typeof(values) == 'object') {
					message = message.replace("#VALUES#", values.join(', '));
				}
				errors.push(message);
			};
			
			for(var propCode in params) {
				fieldParams = params[propCode];
				value = fields[propCode];

				switch(fieldParams.type) {
					case "s":
						
						// required
						if(fieldParams.required && (!value || !value.length)) {
							addError('required', propCode);
						}
							
						break;
						
					case "i":
						
						// required
						var stringCheck = typeof(value) == 'string' && value.match(/^\d*$/),
							intCheck = Number.isInteger(value);
						if(fieldParams.required && (!value || (!stringCheck && !intCheck))) {
							addError('required', propCode);
						}
						
						// zero
						if(fieldParams.noZero && parseInt(value) === 0) {
							addError('noZero', propCode);
						}
						
						// positive
						if(fieldParams.positive && parseInt(value) < 0) {
							addError('positive', propCode);
						}
						
						// negative
						if(fieldParams.negative && parseInt(value) > 0) {
							addError('negative', propCode);
						}
						
						// inValues
						if(fieldParams.inValues && typeof(fieldParams.values) == 'object') {
							if(fieldParams.values.indexOf(parseInt(value)) < 0 && fieldParams.values.indexOf(value.toString()) < 0) {
								addError('inValues', propCode, fieldParams.values);
							}
						}
							
						break;
						
					case "f":
						
						// required
						var stringCheck = typeof(value) == 'string' && value.match(/^[\d\.]*$/),
							floatCheck = !isNaN(value) && value.toString().indexOf('.') >= 0;
						if(fieldParams.required && (!value || (!stringCheck && !floatCheck))) {
							addError('required', propCode);
						}
						
						// positive
						if(fieldParams.positive && parseFloat(value) < 0) {
							addError('positive', propCode);
						}
						
						// negative
						if(fieldParams.negative && parseFloat(value) > 0) {
							addError('negative', propCode);
						}

							
						break;
						
					case "j":
						
						// required
						if(fieldParams.required && (!value || Object.keys(value).length === 0)) {
							addError('required', propCode);
						}
						
						break;
				}
			}
			
			return errors;
		}
	}
}