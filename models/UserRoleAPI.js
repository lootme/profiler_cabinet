var UserRole = cms.getModel('UserRole'),
	UserRoleAction = cms.getModel('UserRoleAction'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {

		if(helper.isNumeric(params.id)) {
			UserRole.findOne(
				{
					where: {id: params.id},
					include: [{
						model: UserRoleAction,
						through: {
							attributes: ['id', 'name'],
						}
					}]
				}
			)
			.then(function(userRole){
				var actions = [];
				if(userRole.dataValues.UserRoleActions.length) {
					userRole.dataValues.UserRoleActions.forEach(function(userRoleActionInstance){
						actions.push(String(userRoleActionInstance.dataValues.id));
					});
				}
				onResultReady({
					id: userRole.dataValues.id,
					name: userRole.dataValues.name,
					priority: userRole.dataValues.priority,
					actions: actions,
					createdAt: helper.formatDate(userRole.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(userRole.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
		
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';
			
		var findAllSettings = {
			order : [[sortField, sortOrder]],
			include: [{
				model: UserRoleAction,
				attributes: ['id', 'code', 'name']
			}]
		};
			
		// processing filter
		if(params.filter) {
			findAllSettings.where = params.filter;
		}
		
		// processing select
		if(params.select) {
			findAllSettings.attributes = params.select;
		}
		
		// processing include
		if(params.include) {
			findAllSettings.include = helper.extend(findAllSettings.include, params.include);
		}
			
		UserRole.findAll(findAllSettings)
		.then(function(userRoles) {
			var result = [];
			userRoles.forEach(userRole => {
				var actions = [],
					actionsData = [];
				if(userRole.dataValues.UserRoleActions.length) {
					userRole.dataValues.UserRoleActions.forEach(function(userRoleActionInstance){
						actionsData.push(userRoleActionInstance.dataValues);
						actions.push(String(userRoleActionInstance.dataValues.id));
					});
				}
				result.push({
					id: userRole.dataValues.id,
					name: userRole.dataValues.name,
					priority: userRole.dataValues.priority,
					actions: actions,
					actionsData: actionsData,
					createdAt: helper.formatDate(userRole.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(userRole.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
		});
	},
	
	getInstance(params, callback) {
		if(helper.isNumeric(params.id)) {
			UserRole.findOne(
				{
					where: {id: params.id},
					include: [{
						model: UserRoleAction,
						through: {
							attributes: ['name'],
						}
					}]
				}
			)
			.then(function(userRole){
				callback(userRole);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItem : (itemSrc, callback) => {
		console.log('before UserRole.create');
		UserRole.create({
			name: itemSrc.name,
			priority: itemSrc.priority,
		})
		.then(function(userRole){console.log('after UserRole.create');
			if(itemSrc.actions)
				userRole.setUserRoleActions(itemSrc.actions);
		})
		.then(function(userRole){
			callback();
		});
	},
	
	deleteItems : (params, callback) => {
		UserRole.destroy({
			where: { id : params.selectedItems }
		})
		.then(function() {
			callback({ success : true });
		});
	},
	
	getFields : (params, callback) => {
		
		var fields = [],
			field,
			systemFields = ['id', 'createdAt', 'updatedAt'];
			
		for(var propCode in UserRole.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(UserRole.rawAttributes[propCode].values) {
				field.values = [];
				UserRole.rawAttributes[propCode].values.map(function(value){
					field.values.push({name: value, value: String(value)});
				});
			}
			
			fields.push(field);
			
		};
		
		// associations
		field = { code: 'actions', plural: true, values: [] };
		UserRoleAction.findAll()
		.then(function(userRoleActions) {
			userRoleActions.forEach(userRoleAction => {
				field.values.push({
					name: userRoleAction.dataValues.name,
					value: String(userRoleAction.dataValues.id)
				});
			});

			fields.push(field);
			
			callback(fields);
		});
		
		
	},
	
	updateItem : (itemSrc, callback) => {
		var id = itemSrc.id;
		delete itemSrc.id;
		UserRole.update(
			itemSrc,
			{ where: { id: id } }
		)
		.then(function() {
			cms.call('user_role', 'set_user_role_actions', { id : id, actions : itemSrc.actions }, function(result){
				cms.call('user_role', 'get_items', { id : id }, function(userRole){
					callback(userRole);
				});
			});
		});
	},
	
	setUserRoleActions : (params, callback) => {
		cms.call('user_role', 'get_instance', {id: params.id}, function(userRole){
			userRole.setUserRoleActions(params.actions ? params.actions : null)
			.then(function(){
				callback({ success: true });
			});
		});
	},
	
	getUserRoleActions : (params, callback) => {
		var actions = [],
			actionCode;
		if(params.roles) {
			var filter = { id : { $in : [] } };
			for(var id in params.roles) {
				filter.id.$in.push(id);
			}
			cms.call('user_role', 'get_items', {filter: filter}, function(userRoles){
				for(var roleI in userRoles) {
					for(var actionI in userRoles[roleI].actionsData) {
						actionCode = userRoles[roleI].actionsData[actionI].code;
						if(actions.indexOf(actionCode) < 0) {
							actions.push(actionCode);
						}
					}
				}
				callback(actions);
			});
		} else if(params.id) {
			// TODO
			/*cms.call('user_role', 'get_instance', {id: params.id}, function(userRole){
					console.log('SINGLE:::::::::::::::');
					for(var i in userRole){console.log(i);}
					callback(userRole);
			});*/
		} else {
			callback({ success : false, errorMessage : 'no roles passed' });
		}
		
	},
}