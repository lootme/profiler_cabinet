var Measure = cms.getModel('Measure'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
		
		var authUser = false;
		if(!auth.check("MEASURES_VIEW", true)) {
			if(!auth.check("MEASURES_VIEW_OWN")) {
				return onResultReady({});
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(params.where) {
			try {
				where = JSON.parse(params.where);
			} catch(e) {
				where = params.where;
			}
		}

		if(authUser) {
			//where.UserId = authUser.id; TODO checking user by project
		}
		
		if(helper.isNumeric(params.id)) {
			Measure.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(measure){
				onResultReady({
					id: measure.dataValues.id,
					name: measure.dataValues.name,
					ProjectId: measure.dataValues.ProjectId,
					createdAt: helper.formatDate(measure.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(measure.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';

		Measure.findAll({
			order : [[sortField, sortOrder]],
			where : where
		})
		.then(function(measures) {
			
			if(!measures.length) {
				return onResultReady({});
			}
			
			var result = [];
			
			// gettings measures count and average values
			var pointsParams = { where: { MeasureId : [] } };
			measures.forEach(measure => {
				pointsParams.where.MeasureId.push(measure.dataValues.id);
			});
			cms.call('point', 'getItems', pointsParams, function(points){
				var pointsData = {};
				points.forEach(point => {
					if(!pointsData[point.MeasureId]) {
						pointsData[point.MeasureId] = {
							Measures: [],
							MemAVG: 0,
							TimeAVG: 0,
						};
					}
					if(pointsData[point.MeasureId].Measures.indexOf(point.sessionId) < 0) {
						pointsData[point.MeasureId].Measures.push(point.sessionId);
					}
					// TODO here we can simply take last point values
					if(point.PointTypeId == 1) {
						pointsData[point.MeasureId].MemAVG += parseFloat(point.diff);
					} else if(point.PointTypeId == 2) {
						pointsData[point.MeasureId].TimeAVG += parseFloat(point.diff);
					}
				});
				Object.keys(pointsData).map((measureId, index) => {
					pointsData[measureId].MemAVG =
						pointsData[measureId].MemAVG /
						pointsData[measureId].Measures.length;
					pointsData[measureId].TimeAVG =
						pointsData[measureId].TimeAVG /
						pointsData[measureId].Measures.length;
				});

				measures.forEach(measure => {
					if(!pointsData[measure.dataValues.id]) {
						return; // no points yet
					}
					result.push({
						id: measure.dataValues.id,
						name: measure.dataValues.name,
						ProjectId: measure.dataValues.UserId,
						Measures: pointsData[measure.dataValues.id].Measures.length,
						MemAVG: pointsData[measure.dataValues.id].MemAVG,
						TimeAVG: pointsData[measure.dataValues.id].TimeAVG,
						createdAt: helper.formatDate(measure.dataValues.createdAt.toString(), true),
						updatedAt: helper.formatDate(measure.dataValues.updatedAt.toString(), true)
					});
				});

				onResultReady(result);
			});

		});
	},
	
	getInstance(params, callback) {
		
		var authUser = false;
		if(!auth.check("MEASURES_VIEW", true)) {
			if(!auth.check("MEASURES_VIEW_OWN")) {
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
			Measure.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(measure){
				callback(measure);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItem : (itemSrc, callback) => {
		console.log('itemSrc is', itemSrc);
		
		var authUser = false;
		if(!auth.check("MEASURES_ADD", true)) {
			if(!auth.check("MEASURES_ADD_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}

		var Measure = cms.getModel('Measure'),
			measureProjectId = authUser ? authUser.id : itemSrc.ProjectId // TODO check that project belongs to user
		Measure.create({
			name: itemSrc.name,
			ProjectId: measureProjectId
		})
		.then(function(){
			callback({ success: true });
		});
	},
	
	deleteItems : (params, callback) => {
		
		var authUser = false;
		if(!auth.check("MEASURES_DELETE", true)) {
			if(!auth.check("MEASURES_DELETE_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;  // TODO check that project belongs to user
		}
		
		Measure.destroy({
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

		for(var propCode in Measure.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(Measure.rawAttributes[propCode].values) {
				field.values = [];
				Measure.rawAttributes[propCode].values.map(function(value){
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
		if(!auth.check("MEASURES_UPDATE", true)) {
			if(!auth.check("MEASURES_UPDATE_OWN")) {
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
		Measure.update(
			itemSrc,
			{ where: helper.extend(where, {id: id}), }
		)
		.then(function() {
			cms.call('measure', 'get_items', { id : id }, function(measure){
				callback(measure);
			});
		});
	}
}