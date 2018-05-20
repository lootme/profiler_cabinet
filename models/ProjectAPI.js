var Project = cms.getModel('Project'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
		
		var authUser = false;
		if(!auth.check("VIEW_PROJECTS", true)) {
			if(!auth.check("VIEW_PROJECTS_OWN")) {
				return onResultReady({});
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;
		}
		
		if(helper.isNumeric(params.id)) {
			Project.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(project){
				onResultReady({
					id: project.dataValues.id,
					name: project.dataValues.name,
					user: project.dataValues.UserId,
					createdAt: helper.formatDate(project.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(project.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';
		
		Project.findAll({
			order : [[sortField, sortOrder]],
			where : where
		})
		.then(function(projects) {
			var result = [];
			projects.forEach(project => {
				result.push({
					id: project.dataValues.id,
					name: project.dataValues.name,
					user: project.dataValues.UserId,
					createdAt: helper.formatDate(project.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(project.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
		});
	},
	
	getInstance(params, callback) {
		
		var authUser = false;
		if(!auth.check("VIEW_PROJECTS", true)) {
			if(!auth.check("VIEW_PROJECTS_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;
		}
		
		if(helper.isNumeric(params.id)) {
			Project.findOne(
				{
					where: helper.extend(where, {id : params.id})
				}
			)
			.then(function(project){
				callback(project);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItem : (itemSrc, callback) => {
		console.log('itemSrc is', itemSrc);
		
		var authUser = false;
		if(!auth.check("ADD_PROJECTS", true)) {
			if(!auth.check("ADD_PROJECTS_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		

		var Project = cms.getModel('Project'),
			projectUserId = authUser ? authUser.id : itemSrc.UserId
		Project.create({
			name: itemSrc.name,
			UserId: projectUserId
		})
		.then(function(){
			callback({ success: true });
		});
	},
	
	deleteItems : (params, callback) => {
		
		var authUser = false;
		if(!auth.check("DELETE_PROJECTS", true)) {
			if(!auth.check("DELETE_PROJECTS_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;
		}
		
		Project.destroy({
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
			
		for(var propCode in Project.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(Project.rawAttributes[propCode].values) {
				field.values = [];
				Project.rawAttributes[propCode].values.map(function(value){
					field.values.push({name: value, value: String(value)});
				});
			}
			
			fields.push(field);
			
		};
		
		callback(fields);
	},
	
	updateItem : (itemSrc, callback) => {
		
		var authUser = false;
		if(!auth.check("UPDATE_PROJECTS", true)) {
			if(!auth.check("UPDATE_PROJECTS_OWN")) {
				return callback({ success : false });
			} else {
				authUser = auth.get();
			}
		}
		
		var where = {};
		if(authUser) {
			where.UserId = authUser.id;
			itemSrc.UserId = authUser.id;
		}
		
		var id = itemSrc.id;
		delete itemSrc.id;
		Project.update(
			itemSrc,
			{ where: helper.extend(where, {id: id}), }
		)
		.then(function() {
			cms.call('project', 'get_items', { id : id }, function(project){
				callback(project);
			});
		});
	}
}