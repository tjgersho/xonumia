module.exports = function(sequelize, DataTypes){
return sequelize.define('tile', {
	locX: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	locY: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
          isDecimal: true,
          max: 999999,
          min: -999999
		}
	},
	color_r: {
		type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 255,
		validate: {
			isFloat: true,
			max: 255,
			min: 0
		}
	},
	color_g: {
	type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 255,
		validate: {
			isFloat: true,
			max: 255,
			min: 0
		}
	},
	color_b: {
	type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 255,
		validate: {
			isFloat: true,
			max: 255,
			min: 0
		}
	},
	color_a: {
	type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 1,
		validate: {
			isFloat: true,
			max: 1,
			min: 0
		}
	},
	gu: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	gr: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
		defaultValue: false
	},
	gd: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	gl: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	isAdv:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
},{
hooks: {
beforeValidate: function(tile, options){
            if(typeof(tile.locX) === "number"){
            	console.log("TEST HOOK");
            }
		},
afterUpdate:function(tile, options){
    console.log('After Save HOOK');
}

}

});
};