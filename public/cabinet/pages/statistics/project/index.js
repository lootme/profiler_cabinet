module.exports = (data, onLogicProcessed) => {
	
	cms.setPageTitle("View and analyze statistics - choose measure");
	
	data.instanceManagmentSettings = {
		name : 'measure',
		title : 'Measure',
		view_mode: true,
		has_detail: true,
		filter: {
			ProjectId: data.get.project_id
		}
	};

	onLogicProcessed(data);
}