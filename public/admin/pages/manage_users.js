module.exports = (data, onLogicProcessed) => {

	var helper = cms.useModule('helper');
	
	data.instanceManagmentSettings = {
		name : 'user',
		title : 'Users',
		fields_settings : {
			password_hash : {
				label : 'password'
			},
			api_key : {
				default_value : helper.generateApiKey()
			}
		},
		permissions : ['USERS_VIEW', 'USERS_DEL']
	};

	onLogicProcessed(data);
}