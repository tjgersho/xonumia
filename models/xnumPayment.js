//Transactions
module.exports = function(sequelize, DataTypes){
return sequelize.define('xnumPayment', {
	userId: {
		type: DataTypes.INTEGER,
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
	date: {
		type: DataTypes.DATE
	}
 });
};
