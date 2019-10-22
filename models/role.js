//role.js

module.exports = function(sequelize, DataTypes){
return sequelize.define('role', {
		roleName: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
          notNull: true
		}
	}
});
};