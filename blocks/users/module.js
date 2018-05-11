var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};

			cms.call('User', 'getItems', {}, function(users) {
				result.users = users;
				onLogicProcessed(result);
			});
			/*
			var sortType = helper.defined(params.post, "sort") ?
				params.post.sort.toUpperCase() :
				'ASC';

			var User = cms.getModel('User');
			User.findAll({ order : [['username', sortType]] })
			.then(function(users) {
				result.users = [];
				users.forEach(user => {
					user.dataValues.createdAt = user.dataValues.createdAt.toString();
					result.users.push(user.dataValues);
				});

				onLogicProcessed(result);
			});
			*/

		}
}