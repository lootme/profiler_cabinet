var pg = require('pg'),
	fs = require("fs"),
	path = require("path"),
	models = {};

module.exports = (dbHost, dbName, dbUser, dbPassword, notUseORM) => {

	var notUseORM = notUseORM || false;
	
	if(notUseORM) {
	
		var client = new pg.Client({
			host: dbHost,
			database: dbName,
			user: dbUser,
			password: dbPassword,
		});
		client.connect(function (err) {
			if (err)
				throw err;
		});
		
		return client;
		
	}
	
	// ORM
	var Sequelize = require("sequelize");
	var sequelize = new Sequelize(
		dbName,
		dbUser,
		dbPassword,
		{ host : dbHost, dialect: 'postgres' }
	);

	fs.readdirSync('./models').filter(function(file) {
		return (file.indexOf(".") !== 0 && file.indexOf("API.js") < 0);
	}).forEach(function(file) {
		var model = sequelize.import(path.join('../models', file));
		models[model.name] = model;
	});

	Object.keys(models).forEach(function(modelName) {
		if ("associate" in models[modelName]) {
			models[modelName].associate(models);
		}
	});

	models.sequelize = sequelize;
	models.Sequelize = Sequelize;

	return models;
}