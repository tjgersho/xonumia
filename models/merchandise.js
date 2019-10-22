//Merchandise
module.exports = function(sequelize, DataTypes){
return sequelize.define('merch', {
	sku: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	baseprice: {
		type: DataTypes.FLOAT,
		defaultValue: 0.0,
		validate: {
			isFloat: true,
			max: 999999,
			min: 0
		}
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
	wholesaleprice: {
		type: DataTypes.FLOAT,
		defaultValue: 0.0,
		validate: {
			isFloat: true,
			max: 999999,
			min: 0
		}
	},
	prodinfo: {
		type: DataTypes.STRING,
		allowNull: true
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
	listOrder: {
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