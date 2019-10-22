//comment
module.exports = function(sequelize, DataTypes){
return sequelize.define('comment', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
          isEmail: true
		}
	},
	comment: {
		type: DataTypes.TEXT,
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