module.exports = function(sequelize, DataTypes) {

	var Project = sequelize.define("Project", {
		name: { type: DataTypes.STRING },
	}, {
		classMethods: {
			
			associate: function(models) {
				models.User.hasMany(Project)
			}
			
			/*add: function(email, password, callback) {
					global.db.collection('users', function(err, collection) {
						if (err) {
							callback(true);
							return;
						}
						collection.findOne({email: email.toLowerCase()}, function(eror, item) {
							if (item === null) {
								collection.insert({
									email : email.toLowerCase(),
									password : global.controllers.db.criptpassword(password),
									emailchack : true, roles : []
								},
								{ safe : true },
								function(error, result) {
									if (err) {
										callback(true);
										return;
									}   
									callback(false, result[0]);
								});
							}
							else {
								callback(true, null, 'User already exists');
							}
						});
					});   
			};*/
		}
	});

	return Project;
};