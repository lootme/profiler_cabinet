module.exports = (data, onLogicProcessed) => {
	
	data.instanceManagmentSettings = {
		name : 'point',
		title : 'Point',
		view_mode: true,
		has_detail: true,
		mainClass: 'data-projects-measure-list',
		fields_settings : {
			MeasureId : {
				hide : true
			},
		},
		filter: {
			MeasureId: data.get.measure_id
		},
		groupBy: 'sessionId',
		groupSumm: 'diff'
	};

	onLogicProcessed(data);
}