module.exports = function(sequelize, DataTypes) {

	var Point = sequelize.define("Point", {
		index: { type: DataTypes.INTEGER },
		value: { type: DataTypes.STRING },
		diff: { type: DataTypes.STRING },
		trace: { type: DataTypes.JSON },
		comment: { type: DataTypes.STRING },
		datetime: { type: DataTypes.DATE },
		sessionId: { type: DataTypes.STRING }
	}, {
		classMethods: {
			
			associate: function(models) {
				Point.belongsTo(models.PointType);
				models.Measure.hasMany(Point, {as: 'MeasurePoint'});
			}
			
		}
	});

	return Point;
};