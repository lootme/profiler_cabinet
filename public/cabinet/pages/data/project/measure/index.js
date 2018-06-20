module.exports = (data, onLogicProcessed) => {
	
	cms.setPageTitle("View profiling data - sessions");
	
	data.instanceManagmentSettings = {
		name : 'point',
		title : 'Point',
		view_mode: true,
		has_detail: true,
		fields_settings : {
			MeasureId : {
				hide : true
			},
		},
		filter: {
			MeasureId: data.get.measure_id
		},
		groupBy: 'sessionId',
		groupSumms: [{
			name: 'Memory',
			field: 'diff',
			unit: 'b',
			where: {
				PointTypeId: 1
			},
		}, {
			name: 'Time',
			field: 'diff',
			unit: 's',
			where: {
				PointTypeId: 2
			}
		}]
	};

	onLogicProcessed(data);
}