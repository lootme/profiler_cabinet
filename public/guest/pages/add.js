var helper = cms.useModule('helper');

module.exports = (data, onLogicProcessed) => {

	var models = cms.getModels();
	
	/*cms.call('User', 'getItems', {}, function(users) {
		console.log('API result is [start]', users, '[end]');
	});*/
	
	if(helper.defined(data, "get", "submit")) {
		models.User.create({ username : data.get.title }).then(function(user) {
			models.User.findAll()
			.then(function(users) {
				onLogicProcessed({ redirect : '/add/' });
			});
		});
	}
	else {
		onLogicProcessed(data);
	}
}