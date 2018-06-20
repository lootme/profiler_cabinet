module.exports = (data, onLogicProcessed) => {
	
	data.statisticsSettings = {
		type: 'line',
		multiple: true,
		measure_name: data.get.statistics_type + ' usage',
		instanceName: 'point',
		filter: {
			MeasureId: data.get.measure_id,
			PointTypeId: data.get.statistics_type == 'time' ? 2 : 1
		},
		groupBy: 'sessionId',
		scalesData: {
			x: {
				field: 'comment'
			},
			yLine: {
				field: 'value'
			}
		}
	};

	onLogicProcessed(data);
}