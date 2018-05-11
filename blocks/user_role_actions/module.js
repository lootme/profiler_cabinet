var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};

			cms.call('UserRoleAction', 'getItems', {}, function(userRoleActions) {
				result.userRoleActions = userRoleActions;
				onLogicProcessed(result);
			});
			
		}
}