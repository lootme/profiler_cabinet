var helper = cms.useModule('helper');

module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};
			
			// logic start

			var user = auth.get();
			if(user && helper.defined(params, "get", "logout")){
				if(params.get.logout == 'yes'){
					auth.logout();
					onLogicProcessed(result);
				}
			}
			else if(user){
				result.user = {
					id: user.id,
					name: user.username
				};
				onLogicProcessed(result);
			}else{
				if(helper.defined(params, "post", "login_submit")){
					auth.tryLogin(function(err, user, info){

						if(!user){
							result.errorMessage = info.message;
							onLogicProcessed(result);
						}else{
							result.user = {
								id: user.dataValues.id,
								name: user.dataValues.username
							};
							auth.login(user, function(){
								onLogicProcessed(result);
							});
						}
					});
				}else{
					onLogicProcessed(result);
				}
			}
			
			// logic end
			
			

		}
}