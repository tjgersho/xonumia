//Transactions
module.exports = function(sequelize, DataTypes){
return sequelize.define('advPurchase', {
	userId: {
		type: DataTypes.INTEGER,
	},
	advId: {
		type: DataTypes.INTEGER,
	},
	method: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
          isInt: true,
          max: 5,
          min: 0
		}
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
          isInt: true,
          max: 5,
          min: 0
		}
	},
	amount: {
		type: DataTypes.FLOAT,
		defaultValue: 0.0,
		validate: {
			isFloat: true,
			max: 999999,
			min: 0
		}
	},
	transId: {
		type: DataTypes.STRING
	},
	verificationCode:{
		type: DataTypes.STRING
	}
});
};
