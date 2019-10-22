//Admin Key Value Parameters
module.exports = function(sequelize, DataTypes){
return sequelize.define('admin', {
	keyname: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
		},
	valuestring: {
		type: DataTypes.STRING,
		allowNull: false
	}
	
});
};