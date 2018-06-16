module.exports = function(sequelize, DataTypes) {

	var Point = sequelize.define("Point", {
		value: { type: DataTypes.STRING },
		trace: { type: DataTypes.JSON },
		comment: { type: DataTypes.STRING },
		datetime: { type: DataTypes.DATE },
	}, {
		classMethods: {
			
			associate: function(models) {
				models.Measure.hasMany(Point);
				Point.belongsTo(models.PointType);
			}
			
		}
	});

	return Point;
};