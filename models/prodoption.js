//ProdOptions
module.exports = function(sequelize, DataTypes){
return sequelize.define('prodoption', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.FLOAT,
		defaultValue: 0.0,
		validate: {
			isFloat: true,
			max: 999999,
			min: 0
		}
	},
	inventory: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
          isInt: true,
          max: 9999999,
          min: 0
		}
	},
	imglink: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
          isInt: true,
          max: 3,
          min: 0
		}
	}

});
};