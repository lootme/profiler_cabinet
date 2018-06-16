module.exports = function(sequelize, DataTypes) {

	var Measure = sequelize.define("Measure", {
		name: { type: DataTypes.STRING },
	}, {
		classMethods: {
			
			associate: function(models) {
				models.Project.hasMany(Measure);
			}
			
		}
	});

	return Measure;
};