//xoemail
module.exports = function(sequelize, DataTypes){
return sequelize.define('xoemail', {
	email: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	code: {
		type: DataTypes.STRING,
		allowNull: true
	}

});
};