var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
			
			var result = { instanceName : params.name, title : params.title },
				fieldParams;
			cms.call(params.name, 'getItems', {}, function(instanceItems) {
				result.instanceItems = instanceItems;
				cms.call(params.name, 'getFields', {}, function(instanceFields) {
					
					if(helper.defined(params, 'add_fields_settings')) {
						Object.keys(instanceFields).map((key, index) => {
							fieldParams = params.add_fields_settings[instanceFields[key].code];
							if(fieldParams) {
								//if(fieldParams.hide) {
								//	delete instanceFields[key];
								//} else {
									instanceFields[key] = helper.extend(
										instanceFields[key],
										fieldParams
									);
								//}
							}
						});
					}
					
					result.fields = instanceFields;
					onLogicProcessed(result);
				});
			});
			
		}
}