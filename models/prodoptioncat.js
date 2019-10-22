//ProdOptions
module.exports = function(sequelize, DataTypes){
return sequelize.define('prodoptioncat', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	 }

  });
};