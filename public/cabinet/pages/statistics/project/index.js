module.exports = (data, onLogicProcessed) => {
	
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