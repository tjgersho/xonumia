//subscribe
module.exports = function(sequelize, DataTypes){
return sequelize.define('subscribe', {
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
          isEmail: true
		}
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