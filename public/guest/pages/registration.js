module.exports = (data, onLogicProcessed) => {

	var helper = cms.useModule('helper');
	
	data.instanceManagmentSettings = {
		name : 'user',
		title : 'Users',
		fields_settings : {
			password_hash : {
				label : 'password'
			},
			roles : {
				default_value : [2],
				remove : true
			},
			api_key : {
				default_value : helper.generateApiKey(),
				hide : true
			},
		},
		add_mode: true
	};

	onLogicProcessed(data);
}