//exchangeRates
module.exports = function(sequelize, DataTypes){
return sequelize.define('exchange', {
	type: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	factor: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
          isFloat: true,
          max: 999999,
          min: -999999
		}
	}

});
};