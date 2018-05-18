var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
			
			if(helper.defined(params, 'permissions')) {
				for(var i in params.permissions) {
					if(!auth.check(params.permissions[i])) {
						return onLogicProcessed(false);
					}
				}
			}
				
			var result = { instanceName : params.name, title : params.title };
			cms.call(params.name, 'getItems', {}, function(instanceItems) {
				result.instanceItems = instanceItems;
				cms.call(params.name, 'getFields', {}, function(instanceFields) {
					
					if(helper.defined(params, 'add_fields_settings')) {
						Object.keys(instanceFields).map((key, index) => {
							if(params.add_fields_settings[instanceFields[key].code]) {
								instanceFields[key] = helper.extend(
									instanceFields[key],
									params.add_fields_settings[instanceFields[key].code]
								);
							}
						});
					}
					
					result.fields = instanceFields;
					onLogicProcessed(result);
				});
			});
			
		}
}