//ProdDesc
module.exports = function(sequelize, DataTypes){
return sequelize.define('proddesc', {
	description: {
		type: DataTypes.TEXT
	},
	descripnum: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
          isInt: true,
          max: 9999999,
          min: 0
		}
	}

});
};