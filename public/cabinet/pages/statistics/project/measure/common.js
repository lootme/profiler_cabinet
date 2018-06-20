module.exports = (data, onLogicProcessed) => {
	
	cms.setPageTitle("Measures statistics common graphic");
	
	data.statisticsSettings = {
		type: 'barLine',
		instanceName: 'point',
		filter: {
			MeasureId: data.get.measure_id
		},
		groupBy: 'sessionId',
		groupSumms: [{
			name: 'memory',
			field: 'diff',
			where: {
				PointTypeId: 1
			},
		}, {
			name: 'time',
			field: 'diff',
			where: {
				PointTypeId: 2
			}
		}],
		scalesData: {
			x: {
				field: 'datetime'
			},
			yLine: {
				groupField: true,
				type: 'Summs',
				name: 'time',
				unit: 's',
			},
			yBar: {
				groupField: true,
				type: 'Summs',
				name: 'memory',
				unit: 'b',
			}
		}
	};

	onLogicProcessed(data);
}