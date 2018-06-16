module.exports = function(sequelize, DataTypes) {

	var PointType = sequelize.define("PointType", {
		name: { type: DataTypes.STRING },
		unit: { type: DataTypes.STRING }
	}, {
		classMethods: {
			
		}
	});

	return PointType;
};