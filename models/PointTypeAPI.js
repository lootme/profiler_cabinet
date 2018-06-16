var PointType = cms.getModel('PointType'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
		
		var authUser = false;
		if(!auth.check("POINT_TYPES_VIEW", true)) {
			if(!auth.check("POINT_TYPES_VIEW_OWN")) {
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
			PointType.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(pointType){
				onResultReady({
					id: pointType.dataValues.id,
					name: pointType.dataValues.name,
					MeasureId: pointType.dataValues.MeasureId,
					PointTypeTypeId: pointType.dataValues.PointTypeTypeId,
					createdAt: helper.formatDate(pointType.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(pointType.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';
		
		PointType.findAll({
			order : [[sortField, sortOrder]],
			where : where
		})
		.then(function(pointTypes) {
			var result = [];
			pointTypes.forEach(pointType => {
				result.push({
					id: pointType.dataValues.id,
					name: pointType.dataValues.name,
					MeasureId: pointType.dataValues.MeasureId,
					PointTypeTypeId: pointType.dataValues.PointTypeTypeId,
					createdAt: helper.formatDate(pointType.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(pointType.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
		});
	},
	
	getInstance(params, callback) {
		
		var authUser = false;
		if(!auth.check("POINT_TYPES_VIEW", true)) {
			if(!auth.check("POINT_TYPES_VIEW_OWN")) {
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
			PointType.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(pointType){
				callback(pointType);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItem : (itemSrc, callback) => {
		console.log('itemSrc is', itemSrc);
		
		var authUser = false;
		if(!auth.check("POINT_TYPES_ADD", true)) {
			if(!auth.check("POINT_TYPES_ADD_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}

		var PointType = cms.getModel('PointType'),
			pointTypeProjectId = authUser ? authUser.id : itemSrc.ProjectId // TODO check that project belongs to user
		PointType.create({
			name: itemSrc.name,
			ProjectId: pointTypeProjectId
		})
		.then(function(){
			callback({ success: true });
		});
	},
	
	deleteItems : (params, callback) => {
		
		var authUser = false;
		if(!auth.check("POINT_TYPES_DELETE", true)) {
			if(!auth.check("POINT_TYPES_DELETE_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;  // TODO check that project belongs to user
		}
		
		PointType.destroy({
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

		for(var propCode in PointType.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(PointType.rawAttributes[propCode].values) {
				field.values = [];
				PointType.rawAttributes[propCode].values.map(function(value){
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
		if(!auth.check("POINT_TYPES_UPDATE", true)) {
			if(!auth.check("POINT_TYPES_UPDATE_OWN")) {
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
		PointType.update(
			itemSrc,
			{ where: helper.extend(where, {id: id}), }
		)
		.then(function() {
			cms.call('pointType', 'get_items', { id : id }, function(pointType){
				callback(pointType);
			});
		});
	}
}