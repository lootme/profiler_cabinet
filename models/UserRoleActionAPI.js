var UserRoleAction = cms.getModel('UserRoleAction'),
	helper = cms.useModule('helper');
module.exports = {
	getItems : (params, onResultReady) => {
	
		var sortField = params.sortBy || 'name',
			sortOrder = params.orderBy || 'ASC';
			
		UserRoleAction.findAll({ order : [[sortField, sortOrder]] })
		.then(function(UserRoleActions) {
			var result = [];
			UserRoleActions.forEach(UserRoleAction => {
				result.push({
					id: UserRoleAction.dataValues.id,
					name: UserRoleAction.dataValues.name,
					code: UserRoleAction.dataValues.code,
					createdAt: UserRoleAction.dataValues.createdAt.toString()
				});
			});

			onResultReady(result);
		});
	},
	
	addItem : (itemSrc, callback) => {
		UserRoleAction.bulkCreate([
			{ name: itemSrc.name, code: itemSrc.code },
		], { fields: ['name', 'code'] }).then(()=>{
			callback({ success: true });
		});
	},
	
	deleteItems : (params, callback) => {
		UserRoleAction.destroy({
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
		for(var propCode in UserRoleAction.rawAttributes) {
		
			// ignoring system fields
			if(systemFields.indexOf(propCode) >= 0)
				continue;
				
			field = { code: propCode };
			if(UserRoleAction.rawAttributes[propCode].values)
				field.values = UserRoleAction.rawAttributes[propCode].values;
			fields.push(field);
		};
		callback(fields);
	},
	
	updateItem : (itemSrc, callback) => {
		var id = itemSrc.id;
		delete itemSrc.id;
		UserRoleAction.update(
			itemSrc,
			{ where: { id: id } }
		)
		.then(function() {
			callback({ success : true });
		});
	},
}