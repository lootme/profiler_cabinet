module.exports = (data, onLogicProcessed) => {

	var helper = cms.useModule('helper');
	
	var user = auth.get();
	
	cms.setPageTitle("Manage projects");
	
	data.instanceManagmentSettings = {
		name : 'project',
		title : 'Projects',
		mainClass: 'manage-projects-list',
		fields_settings : {
			UserId : {
				hide : true
			}
		}
	};

	onLogicProcessed(data);
}