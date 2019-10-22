//ProdImgs
module.exports = function(sequelize, DataTypes){
return sequelize.define('prodimg', {
	img: {
		type: DataTypes.STRING,
		allowNull: true
	}
	
});
};