module.exports = function(sequelize, DataTypes){


return sequelize.define('map', {
	mapname: {
		type: DataTypes.STRING,
		allowNull: false
		
	},
	startXtile:{
		type: DataTypes.FLOAT,
		allowNull: true,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	startYtile:{
		type: DataTypes.FLOAT,
		allowNull: true,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	finishXtile:{
		type: DataTypes.FLOAT,
		allowNull: true,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	finishYtile:{
		type: DataTypes.FLOAT,
		allowNull: true,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	minX: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: -10,
		validate: {
          isInt: true,
          max: 999999,
          min: -999999
		}
	},
	maxX: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 10,
		validate: {
          isInt: true,
          max: 999999,
          min: -999999
		}
	},
	minY: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: -10,
		validate: {
          isInt: true,
          max: 999999,
          min: -999999
		}
	},
	maxY: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 10,
		validate: {
          isInt: true,
          max: 999999,
          min: -999999
		}
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	mapclass: {
		type: DataTypes.STRING,
		allowNull: true
	},
	mapIntro: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	startSquare:{
		type: DataTypes.TEXT,
		allowNull: true
	},
	endSquare: {
		type: DataTypes.TEXT,
		allowNull: true
	}
},{});


};