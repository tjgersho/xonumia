//Transactions
module.exports = function(sequelize, DataTypes){
return sequelize.define('merchSale', {
	userId: {
		type: DataTypes.INTEGER
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
	transnum: {
		type: DataTypes.STRING
	},
	cart:{
		type: DataTypes.TEXT
	},
	verificationCode:{
		type: DataTypes.STRING
	},
	billing_first_name: {
		type: DataTypes.STRING
	},
	billing_last_name: {
		type: DataTypes.STRING
	},
	billing_address1: {
		type: DataTypes.STRING
	},
	billing_address2: {
		type: DataTypes.STRING
	},
	billing_city: {
		type: DataTypes.STRING
	},
	billing_state: {
		type: DataTypes.STRING
	},
	billing_postal: {
		type: DataTypes.STRING
	},
	billing_country: {
		type: DataTypes.STRING
	},
	billing_phone: {
		type: DataTypes.STRING
	},
	shipping_first_name: {
		type: DataTypes.STRING
	},
	shipping_last_name: {
		type: DataTypes.STRING
	},
	shipping_address1: {
		type: DataTypes.STRING
	},
	shipping_address2: {
		type: DataTypes.STRING
	},
	shipping_city: {
		type: DataTypes.STRING
	},
	shipping_state: {
		type: DataTypes.STRING
	},
	shipping_postal: {
		type: DataTypes.STRING
	},
	shipping_country: {
		type: DataTypes.STRING
	},
	shipping_phone: {
		type: DataTypes.STRING
	}

});
};