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
		permissions : ['USERS_VIEW', 'USERS_DEL'],
		mainClass: 'users-list',
		rowClass: 'users-list-row',
		cellClass: 'users-list-row-cell',
		addFormClass: 'users-add-form',
		buttonsClass: 'users-list-buttons',
	};

	onLogicProcessed(data);
}