///xnum  MODEL
var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes){
var xnum = sequelize.define('xnum', {
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
	level: {
	  type: DataTypes.INTEGER,
	  allowNull: false,
	  defaultValue: 0,
	  validate: {
          isInt: true,
          max: 29,
          min: 0
		}
       },
	valDollar: {
		type: DataTypes.FLOAT,
		allowNull: true,
		defaultValue: 0.001
	},
	found:{
        type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	paid:{
        type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},
	payRequested:{
        type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},
	lock: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [5, 100]
			},
			set: function (value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedLock = bcrypt.hashSync(value, salt);
				this.setDataValue('lock', value);
				this.setDataValue('lockSalt', salt);
				this.setDataValue('lockHash', hashedLock);
			}
		},
	lockSalt:{
			type: DataTypes.STRING
		},
	lockHash: {type: DataTypes.STRING}
},{
hooks: {
beforeValidate: function(tile, options){
            if(typeof(tile.locX) === "number"){
            	//console.log("TEST HOOK");
            }
		}

},
	  classMethods:{
	  		authenticate: function(body){
	  			return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}
					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});
				});
	  	  },
			payoutToken: function(token) {

				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, '$$!xo-Money!$$');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, '123xo321');
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
			}

	  },
	  instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				console.log('TO PUBLIC UNPARSED');
				console.log(json);
				return _.pick(json, 'id', 'valDollar', 'createdAt', 'updatedAt');
			},
			generateToken: function(val) {
				try {

					var stringData = JSON.stringify({
						id: this.get('id')
					});

					var encryptedData = cryptojs.AES.encrypt(stringData, '123xo321').toString();
					var token = jwt.sign({
						token: encryptedData
					}, '$$!xo-Money!$$');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}


});

return xnum;
};