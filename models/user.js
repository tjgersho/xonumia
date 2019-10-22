//user.js  MODEL

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');


module.exports = function(sequelize, DataTypes){
	
	var user = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
              validate: {
              	isEmail: true
              },
              set : function(val){
            	  this.setDataValue('email', val.toLowerCase());
              }
		},
		role:{
			type: DataTypes.INTEGER,
			allowNull: false,
			get : function(){
				return this.getDataValue('role');
			}
			// set : function(val){
			// 	this.setDataValue('role', 0);
			// }
		},
		salt:{
			type: DataTypes.STRING
		},
		password_hash:{
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [5, 100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		},
		xBits: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 0,
		 validate: {
         		 isInt: true,
         		 min: 0
		        }
	          },
		bodyColorR: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 255,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	          },
		bodyColorG: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 0,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	          },
		bodyColorB: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 0,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	        },
		 bodyColorA: {
		 type: DataTypes.FLOAT,
		 allowNull: false,
		 defaultValue: 0.8,
		 validate: {
         		 isDecimal: true,
          		 max: 1,
         		 min: 0
		        }
	        },
		borderColorR: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 0,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	          },
		borderColorG: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 255,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	          },
		borderColorB: {
		 type: DataTypes.INTEGER,
		 allowNull: false,
               defaultValue: 0,
		 validate: {
         		 isInt: true,
          		 max: 255,
         		 min: 0
		        }
	        },
		 borderColorA: {
		 type: DataTypes.FLOAT,
		 allowNull: false,
		 defaultValue: 0.8,
		 validate: {
         		 isDecimal: true,
          		 max: 1,
         		 min: 0
		        }
	        }

	},{
	hooks:{
		beforeValidate: function(user, options){
            if(typeof(user.email) === "string"){
            	user.email = user.email.toLowerCase();
            }
		}
	  },
	  classMethods:{
	  		authenticate: function(body){
	  			return new Promise(function(resolve, reject) {
					if (typeof body.email_or_username !== 'string' || typeof body.password !== 'string') {
						return reject();
					} 

                              var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 					var where_obj = {};

 					if(re.test(body.email_or_username)){
  						 where_obj.where = {email: body.email_or_username};
  					}else{
    						where_obj.where = {username: body.email_or_username};
  					}

					user.findOne(where_obj).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});
				});
	  	      },
			findByToken: function(token) {

				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function (user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function (e) {
							reject();
						});
					} catch (e) {
						reject();
					}
				});
			},
			isAdminToken: function(token) {

				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
						if(tokenData.role === 1){
							user.findById(tokenData.id).then(function (user) {
								if (user) {
									resolve(user);
								} else {
									reject();
								}
							}, function (e) {
								reject();
							});
						}else{
							reject();

						}
						
					} catch (e) {
						reject();
					}
				});
			}

	  },
	  instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				console.log('TO PUBLIC UNPARSED');
				console.log(json);
				return _.pick(json, 
						'id',
						 'username', 
						 'email',
						 'xBits',
						 'bodyColorR', 
						 'bodyColorG',
						 'bodyColorB',
						 'bodyColorA',
						 'borderColorR', 
						 'borderColorG',
						 'borderColorB',
						 'borderColorA',
						 'createdAt',
						 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {

					var stringData = JSON.stringify({
						id: this.get('id'),
						role: this.get('role'),
						type: type
					});

					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}

	});

	

	return user;
};