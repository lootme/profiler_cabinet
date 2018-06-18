var Point = cms.getModel('Point'),
	Measure = cms.getModel('Measure'),
	helper = cms.useModule('helper'),
	validator = cms.useModule('validator', true);
module.exports = {
	getItems : (params, onResultReady) => {
		
		var authUser = false;
		if(!auth.check("POINTS_VIEW", true)) {
			if(!auth.check("POINTS_VIEW_OWN")) {
				return onResultReady({});
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			//where.UserId = authUser.id; TODO checking user by project
		}
		
		if(helper.isNumeric(params.id)) {
			Point.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(point){
				onResultReady({
					id: point.dataValues.id,
					index: point.dataValues.index,
					value: point.dataValues.value,
					diff: point.dataValues.diff,
					trace: point.dataValues.trace,
					comment: point.dataValues.comment,
					datetime: point.dataValues.datetime,
					sessionId: point.dataValues.sessionId,
					MeasureId: point.dataValues.MeasureId,
					PointTypeId: point.dataValues.PointTypeId,
					createdAt: helper.formatDate(point.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(point.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy || 'id',
			sortOrder = params.orderBy || 'ASC';
		
		Point.findAll({
			order : [[sortField, sortOrder]],
			where : where
		})
		.then(function(points) {
			
			if(!points.length) {
				return onResultReady({});
			}

			var result = (params.groupBy) ? {} : [],
				resultItem,
				measureIds = [],
				measureNames = {};
				
			points.forEach(point => {
				measureIds.push(point.dataValues.MeasureId);
			});

			Measure.findAll({
				where : {id : measureIds}
			})
			.then(function(measures) {
				measures.forEach(measure => {
					measureNames[measure.id] = measure.name;
				});

				points.forEach(point => {

					resultItem = {
						id: point.dataValues.id,
						index: point.dataValues.index,
						value: point.dataValues.value,
						diff: point.dataValues.diff,
						trace: point.dataValues.trace,
						comment: point.dataValues.comment,
						datetime: helper.formatDate(point.dataValues.datetime.toString(), true),
						sessionId: point.dataValues.sessionId,
						MeasureId: point.dataValues.MeasureId,
						PointTypeId: point.dataValues.PointTypeId,
						measure: measureNames[point.dataValues.MeasureId],
						createdAt: helper.formatDate(point.dataValues.createdAt.toString(), true),
						updatedAt: helper.formatDate(point.dataValues.updatedAt.toString(), true)
					};
					if(params.groupBy) {
						if(!result[resultItem[params.groupBy]]) {
							result[resultItem[params.groupBy]] = [];
						}
						result[resultItem[params.groupBy]].push(resultItem);
					} else {
						result.push(resultItem);
					}
				});

				onResultReady(result);
			});

		});
	},
	
	getInstance(params, callback) {
		
		var authUser = false;
		if(!auth.check("POINTS_VIEW", true)) {
			if(!auth.check("POINTS_VIEW_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			//where.UserId = authUser.id; TODO checking user by project
		}
		
		if(helper.isNumeric(params.id)) {
			Point.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(point){
				callback(point);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItems : (data, callback) => {
		console.log('in addItems items are:', data);
		
		var processedCount = 0,
			items = JSON.parse(data.items);
		
		// validating
		var errors = validator.check({
			api_key: { type: 's', required: true },
			project_id: { type: 'i', required: true, noZero: true, positive: true },
			measure_name: { type: 's', required: true },
		}, items);
		if(errors.length) {
			cms.setPageError(errors.join(', '));
			return callback({ success: false });
		}
		
		var User = cms.getModel('User');
		User.findOne({ where: {api_key: items.api_key} }).then(function(user) {
			if(user) {
				var Project = cms.getModel('Project');
				Project.findOne({ where: {id: items.project_id, UserId: user.id} }).then(function(project) {
					if(project) {
						var Measure = cms.getModel('Measure'),
							thisMeasure = false;
						Measure.findOrCreate({ where: {name: items.measure_name, ProjectId: project.id} }).then(function(measure) {
							for(var i in items.points) {
								
								var itemSrc = helper.extend(
									{},
									{
										api_key: items.api_key,
										project_id: items.project_id,
										measure_name: items.measure_name,
										session_id: items.session_id,
									},
									items.points[i]
								);
								cms.call('point', 'add_item', itemSrc, function(result){
									processedCount++;
									if(processedCount >= items.points.length) {
										return callback({ success: true });
									}
								});
								
							}
						});
					}
				});
			}
		});
	},
	
	addItem : (itemSrc, callback) => {
		console.log('itemSrc is', itemSrc);
		
		/*var authUser = false;
		if(!auth.check("POINTS_ADD", true)) {
			if(!auth.check("POINTS_ADD_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}*/
		
		// validating
		var errors = validator.check({
			api_key: { type: 's', required: true },
			project_id: { type: 'i', required: true, noZero: true, positive: true },
			session_id: { type: 's', required: true },
			measure_name: { type: 's', required: true },
			type: { type: 'i', required: true, inValues: true, values: [1,2] },
			index: { type: 'i', required: true, positive: true },
			value: { type: 'f', required: true, positive: true },
			diff: { type: 's', required: true },
			trace: { type: 'j', required: true },
			comment: { type: 's', required: true },
			datetime: { type: 's', required: true },
		}, itemSrc);
		if(errors.length) {
			cms.setPageError(errors.join(', '));
			return callback({ success: false });
		}
		
		var User = cms.getModel('User');
		User.findOne({ where: {api_key: itemSrc.api_key} }).then(function(user) {
			if(user) {
				var Project = cms.getModel('Project');
				Project.findOne({ where: {id: itemSrc.project_id, UserId: user.id} }).then(function(project) {
					if(project) {
						var Measure = cms.getModel('Measure'),
							thisMeasure = false;

						Measure.findOrCreate({ where: {name: itemSrc.measure_name, ProjectId: project.id} }).then(function(measure) {
							Point.create({
								index: itemSrc.index,
								value: itemSrc.value,
								diff: itemSrc.diff,
								trace: itemSrc.trace,
								comment: itemSrc.comment,
								datetime: itemSrc.datetime,
								sessionId: itemSrc.session_id,
								MeasureId: measure[0].dataValues.id,
								PointTypeId: itemSrc.type,
							})
							.then(function(){
								callback({ success: true });
							});
						});	
					} else {
						cms.setPageError('project is not found');
						return callback({ success: false });
					}
				});	
			} else {
				cms.setPageError('api key is wrong');
				return callback({ success: false });
			}
		});
	},
	
	deleteItems : (params, callback) => {
		
		var authUser = false;
		if(!auth.check("POINTS_DELETE", true)) {
			if(!auth.check("POINTS_DELETE_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;  // TODO check that project belongs to user
		}
		
		Point.destroy({
			where: helper.extend(where, {id : params.selectedItems})
		})
		.then(function() {
			callback({ success : true });
		});
	},
	
	getFields : (params, callback) => {
		
		var fields = [],
			field,
			systemFields = ['id', 'createdAt', 'updatedAt'];

		for(var propCode in Point.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(Point.rawAttributes[propCode].values) {
				field.values = [];
				Point.rawAttributes[propCode].values.map(function(value){
					field.values.push({name: value, value: String(value)});
				});
			}
			
			fields.push(field);
			
		};

		// associations
		field = { code: 'measure', plural: false, values: [] };
		
		cms.call('measure', 'get_items', {}, function(measures){

			if(measures.length) {
				measures.forEach(measure => {
					field.values.push({
						name: measure.name,
						value: String(measure.id)
					});
				});
			}
			
			fields.push(field);

			callback(fields);
			
		});
		
	},
	
	updateItem : (itemSrc, callback) => {
		
		var authUser = false;
		if(!auth.check("POINTS_UPDATE", true)) {
			if(!auth.check("POINTS_UPDATE_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			//where.UserId = authUser.id; // TODO check that project belongs to user
			itemSrc.ProjectId = authUser.id; // TODO check that project belongs to user
		}
		
		var id = itemSrc.id;
		delete itemSrc.id;
		Point.update(
			itemSrc,
			{ where: helper.extend(where, {id: id}), }
		)
		.then(function() {
			cms.call('point', 'get_items', { id : id }, function(point){
				callback(point);
			});
		});
	}
}