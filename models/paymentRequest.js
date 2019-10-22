//Transactions
module.exports = function(sequelize, DataTypes){
return sequelize.define('paymentRequest', {
	userId: {
		type: DataTypes.INTEGER
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
	xnumCount: {
		type:  DataTypes.INTEGER
	},
	date: {
		type: DataTypes.DATE
	}
 });
};
