var helper = cms.useModule('helper');

module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};
			
			// logic start

			var user = auth.get();
			if(user){
				result.user = {
					id: user.id,
					name: user.username
				};
				onLogicProcessed(result);
			}else{
				onLogicProcessed(result);
			}
			
			// logic end
			
			

		}
}