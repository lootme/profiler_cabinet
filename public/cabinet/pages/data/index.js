module.exports = (data, onLogicProcessed) => {
	
	data.instanceManagmentSettings = {
		name : 'project',
		title : 'Projects',
		view_mode: true,
		has_detail: true,
		mainClass: 'projects-list',
	};

	onLogicProcessed(data);
}