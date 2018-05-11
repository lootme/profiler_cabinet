var helper = cms.useModule('helper');

module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};
			
			// logic start

			if(helper.defined(params, "post", "register_submit"))
			{
				cms.call(
					'User',
					'addItem',
					{
						login : params.post.login,
						psswd : params.post.psswd
					},
					() => {
						console.log('User ' + params.post.login + ' added successfully!!'); 
					}
				);
			}
			// logic end

			onLogicProcessed(result);

		}
}