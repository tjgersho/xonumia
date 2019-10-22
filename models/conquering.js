module.exports = function(sequelize, DataTypes){


return sequelize.define('conquering', {
	  howmanytimes: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: -10,
		validate: {
         	 isInt: true,
         	 max: 999999,
        	 min: 1
	    },
	hasNewTiles:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       },
	hasNewStart:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       },
	hasNewFinish:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       }
     }
},{});


};