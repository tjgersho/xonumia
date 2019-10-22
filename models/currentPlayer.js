//currentPlayers.js  MODEL

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');


module.exports = function(sequelize, DataTypes){
	
	var currentPlayer = sequelize.define('currentPlayers', {
		socketId: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		userId:{
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		x:{
			type: DataTypes.FLOAT,
			allowNull: false
		},
		y:{
			type: DataTypes.FLOAT,
			allowNull: false
		}
	});

	
	return currentPlayer;


};