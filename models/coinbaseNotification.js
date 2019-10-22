//Transactions
module.exports = function(sequelize, DataTypes){
return sequelize.define('coinbaseNotification', {
	verified: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	amount: {
		type: DataTypes.FLOAT,
		defaultValue: 0.0,
		validate: {
			isFloat: true
		}
	},
	notificationId: {
		type: DataTypes.STRING
	},
	type: {
		type: DataTypes.STRING
	},
	name: {
		type: DataTypes.STRING
	},
	transId: {
		type: DataTypes.STRING
	},
	transType:{
		type: DataTypes.STRING
	},
	verificationCode: {
		type: DataTypes.STRING
	},
	cartData: {
		type: DataTypes.TEXT
	},
	customerInfo: {
		type: DataTypes.TEXT

	},
	archive: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
 });
};
