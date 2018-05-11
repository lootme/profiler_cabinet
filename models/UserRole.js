module.exports = function(sequelize, DataTypes) {

	// next line is for many to many relation (not model)
	var UserRolesUserRoleActions = sequelize.define('UserRolesUserRoleActions', {});
	
	var UserRole = sequelize.define("UserRole", {
		name: { type: DataTypes.STRING, allowNull: false },
		priority: { type: DataTypes.ENUM("1","2","3","4","5","6","7","8","9","10"), allowNull: false },
	}, {
		classMethods: {
			
			associate: function(models) {
				UserRole.belongsToMany(models.UserRoleAction, { through: UserRolesUserRoleActions })
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
	
	return UserRole;
};