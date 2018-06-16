module.exports = (data, onLogicProcessed) => {

	var helper = cms.useModule('helper');
	
	var user = auth.get();
	
	data.instanceManagmentSettings = {
		name : 'measure',
		title : 'Measures',
		fields_settings : {
			ProjectId : {
				hide : true
			}
		}
	};

	onLogicProcessed(data);
}