var User = cms.getModel('User'),
	UserRole = cms.getModel('UserRole'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
		
		if(!auth.check("USERS_VIEW"))
			return onResultReady({});
		
		if(helper.isNumeric(params.id)) {
			User.findOne(
				{
					where: {id: params.id},
					include: [{
						model: UserRole,
						through: {
							attributes: ['id'],
						}
					}]
				}
			)
			.then(function(user){
				var roles = [];
				if(user.dataValues.UserRoles.length) {
					user.dataValues.UserRoles.forEach(function(userRoleInstance){
						roles.push(String(userRoleInstance.dataValues.id));
					});
				}
				onResultReady({
					id: user.dataValues.id,
					username: user.dataValues.username,
					roles: roles,
					createdAt: helper.formatDate(user.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(user.dataValues.updatedAt.toString(), true)
				});
			});
			return;
		}
	
		var sortField = params.sortBy && params.sortBy != 'name' ? params.sortBy : 'username',
			sortOrder = params.orderBy || 'ASC';
		
		User.findAll({
			order : [[sortField, sortOrder]],
			include: [{
				model: UserRole,
				through: {
					attributes: ['id'],
				}
			}]
		})
		.then(function(users) {
			var result = [];
			users.forEach(user => {
				var roles = [];
				if(user.dataValues.UserRoles.length) {
					user.dataValues.UserRoles.forEach(function(userRoleInstance){
						roles.push(String(userRoleInstance.dataValues.id));
					});
				}
				result.push({
					id: user.dataValues.id,
					username: user.dataValues.username,
					roles: roles,
					createdAt: helper.formatDate(user.dataValues.createdAt.toString(), true),
					updatedAt: helper.formatDate(user.dataValues.updatedAt.toString(), true)
				});
			});

			onResultReady(result);
		});
	},
	
	getInstance(params, callback) {
		if(helper.isNumeric(params.id)) {
			User.findOne(
				{
					where: {id: params.id},
					include: [{
						model: UserRole,
						through: {
							attributes: ['name'],
						}
					}]
				}
			)
			.then(function(user){
				callback(user);
			});
		} else {
			callback({ success : false, errorMessage : 'no item id passed' });
		}
	},
	
	addItem : (itemSrc, callback) => {
		
		if(!auth.check("USERS_ADD"))
			return callback({ success: false });
		
		var User = cms.getModel('User');
		auth.encrypt(itemSrc.password_hash, (hash)=>{
			User.create({
				username: itemSrc.username,
				password_hash: hash,
			})
			.then(function(){
				callback({ success: true });
			});
		});
	},
	
	deleteItems : (params, callback) => {
		User.destroy({
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
			
		for(var propCode in User.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			
			if(User.rawAttributes[propCode].values) {
				field.values = [];
				User.rawAttributes[propCode].values.map(function(value){
					field.values.push({name: value, value: String(value)});
				});
			}
			
			fields.push(field);
			
		};
		
		// associations
		field = { code: 'roles', plural: true, values: [] };
		UserRole.findAll()
		.then(function(userRoles) {
			userRoles.forEach(userRole => {
				field.values.push({
					name: userRole.dataValues.name,
					value: String(userRole.dataValues.id)
				});
			});

			fields.push(field);
			
			callback(fields);
		});
	},
	
	updateItem : (itemSrc, callback) => {
		var id = itemSrc.id;
		delete itemSrc.id;
		User.update(
			itemSrc,
			{ where: { id: id } }
		)
		.then(function() {
			cms.call('user', 'set_user_roles', { id : id, roles : itemSrc.roles }, function(result){
				cms.call('user', 'get_items', { id : id }, function(user){
					callback(user);
				});
			});
		});
	},
	
	setUserRoles : (params, callback) => {
		cms.call('user', 'get_instance', {id: params.id}, function(user){
			user.setUserRoles(params.roles ? params.roles : null)
			.then(function(){
				callback({ success: true });
			});
		});
	},
	
	getUserRoles : (params, callback) => {
		cms.call('user', 'get_instance', {id: params.id}, function(user){
			user.getUserRoles().then(function(roles){
				callback(roles);
			});
		});
	},
	
	getRoles : (params, callback) => {
		callback(
			User//.getUserRoles()
		);
	}
}