module.exports = function(sequelize, DataTypes) {
	
	// next line is for many to many relation (not model)
	var UserUserRole = sequelize.define('UserUserRole', {});
	
	var User = sequelize.define("User", {
		username: { type: DataTypes.STRING, allowNull: false },
		password_hash: { type: DataTypes.STRING, allowNull: false },
	}, {
		classMethods: {
		
			associate: function(models) {
				User.belongsToMany(models.UserRole, { through: UserUserRole })
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

	return User;
};