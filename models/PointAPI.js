var Point = cms.getModel('Point'),
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
					name: point.dataValues.name,
					MeasureId: point.dataValues.MeasureId,
					PointTypeId: point.dataValues.PointTypeId,
					createdAt: helper.formatDate(point.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(point.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';
		
		Point.findAll({
			order : [[sortField, sortOrder]],
			where : where
		})
		.then(function(points) {
			var result = [];
			points.forEach(point => {
				result.push({
					id: point.dataValues.id,
					name: point.dataValues.name,
					MeasureId: point.dataValues.MeasureId,
					PointTypeId: point.dataValues.PointTypeId,
					createdAt: helper.formatDate(point.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(point.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
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
			measure_name: { type: 's', required: true },
			type: { type: 'i', required: true, inValues: true, values: [1,2] },
			value: { type: 'f', required: true, noZero: true, positive: true },
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
								value: itemSrc.value,
								trace: itemSrc.trace,
								comment: itemSrc.comment,
								datetime: itemSrc.datetime,
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
		field = { code: 'project', plural: false, values: [] };
		
		cms.call('project', 'get_items', {}, function(projects){

			if(projects.length) {
				projects.forEach(project => {
					field.values.push({
						name: project.name,
						value: String(project.id)
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