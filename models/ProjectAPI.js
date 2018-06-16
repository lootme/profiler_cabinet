var Project = cms.getModel('Project'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
		
		var authUser = false;
		if(!auth.check("PROJECTS_VIEW", true)) {
			if(!auth.check("PROJECTS_VIEW_OWN")) {
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
					UserId: project.dataValues.UserId,
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
					UserId: project.dataValues.UserId,
					createdAt: helper.formatDate(project.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(project.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
		});
	},
	
	getInstance(params, callback) {
		
		var authUser = false;
		if(!auth.check("PROJECTS_VIEW", true)) {
			if(!auth.check("PROJECTS_VIEW_OWN")) {
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
		
		var authUser = auth.get(),
			forceOwn = false;
		if(!auth.check("PROJECTS_ADD", true)) {
			if(!auth.check("PROJECTS_ADD_OWN")) {
				return callback({ success : false });
			} else {
				forceOwn = true;
			}
		}
		

		var Project = cms.getModel('Project'),
			projectUserId = forceOwn ? authUser.id : (itemSrc.UserId ? itemSrc.UserId : authUser.id);
			console.log("!!!", projectUserId, authUser, itemSrc);
		Project.create({
			name: itemSrc.name,
			UserId: projectUserId
		})
		.then(function(){
			callback({ success: true });
		});
	},
	
	addItemRemote : (itemSrc, callback) => {
		console.log('addItemRemote called!!!', itemSrc);
		
		var Project = cms.getModel('Project'),
			projectUserId = itemSrc.UserId
		Project.create({
			name: itemSrc.name,
			UserId: itemSrc.userId
		})
		.then(function(){
			callback({ success: true });
		});
	},
	
	deleteItems : (params, callback) => {
		
		var authUser = false;
		if(!auth.check("PROJECTS_DELETE", true)) {
			if(!auth.check("PROJECTS_DELETE_OWN")) {
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
		if(!auth.check("PROJECTS_UPDATE", true)) {
			if(!auth.check("PROJECTS_UPDATE_OWN")) {
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