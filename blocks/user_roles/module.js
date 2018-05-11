var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};

			cms.call('UserRole', 'getItems', {}, function(userRoles) {
				result.userRoles = userRoles;
				onLogicProcessed(result);
			});
			
		}
}