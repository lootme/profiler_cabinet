var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
			var result = {
					instanceName : params.name,
					title : params.title,
					addMode : params.add_mode || false,
					viewMode : params.view_mode || false,
					addCallback : params.add_callback || false,
					mainClass : ' ' + params.mainClass || '',
					rowClass : ' ' + params.rowClass || '',
					cellClass : ' ' + params.cellClass || '',
					addFormClass : ' ' + params.addFormClass || '',
					buttonsClass : ' ' + params.buttonsClass || '',
				},
				fieldParams;
			
			cms.call(params.name, 'getFields', {}, function(instanceFields) {

				if(helper.defined(params, 'fields_settings')) {
					Object.keys(instanceFields).map((key, index) => {
						fieldParams = params.fields_settings[instanceFields[key].code];
						if(fieldParams) {
							//if(fieldParams.hide) {
							//	delete instanceFields[key];
							//} else {
								if(fieldParams.remove) {
									delete instanceFields[key];
								} else {
									instanceFields[key] = helper.extend(
										instanceFields[key],
										fieldParams
									);
								}
							//}
						}
					});
				}
				result.fields = instanceFields;
				
				if(result.addMode) {

					onLogicProcessed(result);
					
				} else {
					var apiCallParams = {};
					if(params.filter) {
						apiCallParams.where = params.filter;
						result.filter = params.filter;
					}
					if(params.groupBy) {
						apiCallParams.groupBy = params.groupBy;
						result.groupBy = params.groupBy;
						
						if(params.groupSumm) {
							result.groupSumm = params.groupSumm;
						}
						
						if(params.groupAvg) {
							result.groupAvg = params.groupAvg;
						}
					}

					cms.call(params.name, 'getItems', apiCallParams, function(instanceItems) {
						
						result.instanceItems = instanceItems;
						
						// making detail links
						if(params.has_detail) {
							Object.keys(instanceItems).map((key, index) => {
								if(instanceItems[key].id) {
									instanceItems[key].detailLink = cms.getCurrentUrl() +  params.name + '-' + instanceItems[key].id + '/';
								}
							});
						}
						
						onLogicProcessed(result);
					});
				}		
				
			});
			
		}
}