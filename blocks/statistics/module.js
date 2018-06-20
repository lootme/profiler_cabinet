var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
			
			var result = {
				type: params.type,
				multiple: params.multiple,
			};
			
			// function to calculate one group field for one group of items
			const calculateGroupField = (groupParams, calcType, groupItems) => {
				var countedValue = 0,
					currentItem;
				
				for(var groupField in groupItems) {
					currentItem = groupItems[groupField];
					
					if(typeof(groupParams.where) == 'object') {
						for(var whereField in groupParams.where) {
							if(currentItem[whereField] === groupParams.where[whereField]) {
								if(calcType == 'Summs') {
									countedValue += parseFloat(currentItem[groupParams.field]);
								}
							}
						}
					} else {
						if(calcType == 'Summs') {
							countedValue += parseFloat(currentItem[groupParams.field]);
						}
					}
				}
				
				return countedValue;
			}
			
			// getting data
			var apiCallParams = {};
			if(params.filter) {
				apiCallParams.where = params.filter;
				result.filter = params.filter;
			}
			if(params.groupBy) {
				apiCallParams.groupBy = params.groupBy;
			}
			cms.call(params.instanceName, 'getItems', apiCallParams, function(instanceItems) {

				if(params.groupBy) {
					// processing groups
					var usedGroupTypes = [],
						currentGroupType,
						currentGroupCollection,
						currentGroupCollectionItem,
						countedGroupValues = {};
					for(var i in params.scalesData) {
						if(params.scalesData[i].groupField) {
							currentGroupType = params.scalesData[i].type;
							if(usedGroupTypes.indexOf(currentGroupType) < 0) {
								usedGroupTypes.push(params.scalesData[i].type);
							}
						}
					}
					for(var i in usedGroupTypes) {
						currentGroupCollection = params["group" + usedGroupTypes[i]];
						if(currentGroupCollection) {
							for(var j in currentGroupCollection) {
								currentGroupCollectionItem = currentGroupCollection[j];
								countedGroupValues[currentGroupCollectionItem.name] = [];
								Object.keys(instanceItems).map((groupId, index) => {
									countedGroupValues[currentGroupCollectionItem.name].push(calculateGroupField(
										currentGroupCollectionItem,
										usedGroupTypes[i],
										instanceItems[groupId]
									));
								});
							}
						}
					}
				}
				
				var currentScale,
					currentGroupItems,
					groupScaleValues = params.groupBy && !usedGroupTypes.length && params.multiple;
				result.values = {};
				for(var scaleName in params.scalesData) {
					currentScale = params.scalesData[scaleName];
					if(currentScale.groupField) {
						result.values[scaleName] = {
							values: countedGroupValues[currentScale.name],
							unit: currentScale.unit
						};
					} else {
						result.values[scaleName] = {
							values: groupScaleValues ? {} : [],
							unit: currentScale.unit
						};
						if(params.groupBy) {
							Object.keys(instanceItems).map((groupId, index) => {
								currentGroupItems = instanceItems[groupId];
								for(var i in currentGroupItems) {
									if(usedGroupTypes.length) {
										// if group fields were used - we take value only from first group item
										result.values[scaleName].values.push(currentGroupItems[i][currentScale.field]);
										break;
									} else {
										// items are grouped but no group field were used - take each value
										if(params.multiple) {
											// using multiple graphics - we need to group values for scales
											if(!result.values[scaleName].values[groupId]) {
												result.values[scaleName].values[groupId] = [];
											}
											result.values[scaleName].values[groupId].push(currentGroupItems[i][currentScale.field]);
										} else {
											result.values[scaleName].values.push(currentGroupItems[i][currentScale.field]);
										}
									}
								}
							});
						} else {
							Object.keys(instanceItems).map((key, index) => {
								currentItem = instanceItems[key];
								result.values[scaleName].values.push(currentItem[currentScale.field]);
							});
						}
					}
				}

				console.log(JSON.stringify(result, null, 4));
				
				
				// plugin options
				switch(params.type) {
					
					case "barLine":
						
						result.plugin = {
							data: {
								//labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
								datasets: [{
								  label: 'Time usage',
								  type:'line',
								  data: result.values.yLine.values,
								  fill: false,
								  borderColor: '#EC932F',
								  backgroundColor: '#EC932F',
								  pointBorderColor: '#EC932F',
								  pointBackgroundColor: '#EC932F',
								  pointHoverBackgroundColor: '#EC932F',
								  pointHoverBorderColor: '#EC932F',
								  yAxisID: 'y-axis-2'
								},{
								  type: 'bar',
								  label: 'Memory usage',
								  data: result.values.yBar.values,
								  fill: false,
								  backgroundColor: '#71B37C',
								  borderColor: '#71B37C',
								  hoverBackgroundColor: '#71B37C',
								  hoverBorderColor: '#71B37C',
								  yAxisID: 'y-axis-1'
								}]
							},
							options: {
								responsive: true,
								labels: result.values.x.values,
								tooltips: {
									mode: 'label'
								},
								elements: {
									line: {
									  fill: false
									}
								},
								scales: {
									xAxes: [
									  {
										display: true,
										gridLines: {
										  display: false
										},
										labels: result.values.x.values,
									  }
									],
									yAxes: [
									  {
										type: 'linear',
										display: true,
										position: 'left',
										id: 'y-axis-1',
										gridLines: {
										  display: false
										},
										labels: {
										  show: true
										}
									  },
									  {
										type: 'linear',
										display: true,
										position: 'right',
										id: 'y-axis-2',
										gridLines: {
										  display: false
										},
										labels: {
										  show: true
										}
									  }
									]
								}
							},
							plugins: [{
								afterDraw: (chartInstance, easing) => {
									const ctx = chartInstance.chart.ctx;
									ctx.fillText("This text drawn by a plugin", 100, 100);
								}
							}],
						}
						
						break;
					
					case "line":
						
						if(groupScaleValues) {
							
							result.data = {};
							
							for(var groupId in result.values.x.values) {
								result.data[groupId] = {
								  labels: result.values.x.values[groupId],
								  datasets: [
									{
									  label: params.measure_name,
									  fill: false,
									  lineTension: 0.1,
									  backgroundColor: 'rgba(75,192,192,0.4)',
									  borderColor: 'rgba(75,192,192,1)',
									  borderCapStyle: 'butt',
									  borderDash: [],
									  borderDashOffset: 0.0,
									  borderJoinStyle: 'miter',
									  pointBorderColor: 'rgba(75,192,192,1)',
									  pointBackgroundColor: '#fff',
									  pointBorderWidth: 1,
									  pointHoverRadius: 5,
									  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
									  pointHoverBorderColor: 'rgba(220,220,220,1)',
									  pointHoverBorderWidth: 2,
									  pointRadius: 1,
									  pointHitRadius: 10,
									  data: result.values.yLine.values[groupId],
									}
								  ]
								};
							}
							
						} else {
							
							result.data = {
							  labels: result.values.x.values,
							  datasets: [
								{
								  label: params.measure_name,
								  fill: false,
								  lineTension: 0.1,
								  backgroundColor: 'rgba(75,192,192,0.4)',
								  borderColor: 'rgba(75,192,192,1)',
								  borderCapStyle: 'butt',
								  borderDash: [],
								  borderDashOffset: 0.0,
								  borderJoinStyle: 'miter',
								  pointBorderColor: 'rgba(75,192,192,1)',
								  pointBackgroundColor: '#fff',
								  pointBorderWidth: 1,
								  pointHoverRadius: 5,
								  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
								  pointHoverBorderColor: 'rgba(220,220,220,1)',
								  pointHoverBorderWidth: 2,
								  pointRadius: 1,
								  pointHitRadius: 10,
								  data: result.values.yLine.values,
								}
							  ]
							};
							
						}
						
						break;
				}
				
				
				onLogicProcessed(result);
			});
			
			
			

			
		}
}