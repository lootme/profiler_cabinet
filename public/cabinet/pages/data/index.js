module.exports = (data, onLogicProcessed) => {
	
	cms.setPageTitle("View profiling data - choose project");
	
	data.instanceManagmentSettings = {
		name : 'project',
		title : 'Projects',
		view_mode: true,
		has_detail: true,
		mainClass: 'projects-list',
	};

	onLogicProcessed(data);
}