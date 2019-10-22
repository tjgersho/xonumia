module.exports = function(sequelize, DataTypes){
return sequelize.define('adv', {
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
	width: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			isInt: true,
			max: 255,
			min: 1
		}
	},
	height: {
	   type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			isInt: true,
			max: 255,
			min: 1
		}
	},
	img: {
	    type: DataTypes.STRING,
		allowNull: false
	},
	aspect: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	link:{
		 type: DataTypes.STRING,
		allowNull: true
       },
	hasLink:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       },
       available: {  //..sponsorship is available
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
       },
	sponsorshipInterest: {  //Someone Clicked to try and sponsor.. Set to true so no one else can click in the meantime. Also change picture..
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       },
	approved: {  //The ads .. especially once contain links..need approval before running.
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
       },
	active: {  //State that sponsorship is in goodStanding... show the sponsorship add..
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}, 
	paid: {  //State when transaction goes through
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}, 
	dueup: { //State when sponsorship is owned, but is due for renewal.  Triggers an email...
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	purchaseDate:{  //Date when purchased...
		type: DataTypes.DATE,
		allowNull:true,
	},  
	purchaseAmountOfTime:{  //Amount of Days to run the sponsorship!
		type: DataTypes.INTEGER,
		allowNull: true,
	}
},{
hooks: {
beforeValidate: function(addv, options){
            if(typeof(addv.locX) === "number"){
            	console.log("TEST HOOK");
            }
		}

}

});
};