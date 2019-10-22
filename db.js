'use strict';

//db.js
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

var isAmazon = process.env.USER === 'ubuntu' ? true : false;

if (isAmazon) {
	var dbConnect = require('./dbConnect.json');

	sequelize = new Sequelize(dbConnect.database, dbConnect.username, dbConnect.password, {
		host: dbConnect.host,
		port: dbConnect.port,
		dialect: dbConnect.dialect
	});
} else {

	if (env === 'production') {
		sequelize = new Sequelize(process.env.DATABASE_URL);
	} else {
		sequelize = new Sequelize(undefined, undefined, undefined, {
			'dialect': 'sqlite',
			'storage': __dirname + '/data/devdb.sqlite'
		});
	}
}
var db = {};

////////Load Models///////////////


db.user = sequelize.import(__dirname + '/models/user.js');
db.map = sequelize.import(__dirname + '/models/map.js');
db.mapPulse = sequelize.import(__dirname + '/models/mapPulse.js');
db.tile = sequelize.import(__dirname + '/models/tile.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.xnum = sequelize.import(__dirname + '/models/xnum.js');
db.exchange = sequelize.import(__dirname + '/models/exchange.js');
db.role = sequelize.import(__dirname + '/models/role.js');
db.adv = sequelize.import(__dirname + '/models/adv.js');
db.comment = sequelize.import(__dirname + '/models/comment.js');
db.merch = sequelize.import(__dirname + '/models/merchandise.js');
db.prodimg = sequelize.import(__dirname + '/models/prodimg.js');
db.merchSale = sequelize.import(__dirname + '/models/merchSale.js');
db.advPurchase = sequelize.import(__dirname + '/models/advPurchase.js');
db.prodoptioncat = sequelize.import(__dirname + '/models/prodoptioncat.js');
db.prodoption = sequelize.import(__dirname + '/models/prodoption.js');
db.proddesc = sequelize.import(__dirname + '/models/proddesc.js');
db.xoemail = sequelize.import(__dirname + '/models/xoemail.js');
db.currentPlayer = sequelize.import(__dirname + '/models/currentPlayer.js');
db.admin = sequelize.import(__dirname + '/models/admin.js');
db.conquering = sequelize.import(__dirname + '/models/conquering.js');
db.xnumPayment = sequelize.import(__dirname + '/models/xnumPayment.js');
db.paymentRequest = sequelize.import(__dirname + '/models/paymentRequest.js');
db.coinbaseNotification = sequelize.import(__dirname + '/models/coinbaseNotification.js');

//////////////////////////////////

///////RelationShips/////////


db.xnum.belongsTo(db.user);
db.xnum.hasOne(db.xnumPayment, { as: 'payment', foreignKey: 'paymentId' });
db.xnum.hasOne(db.paymentRequest, { as: 'requestPayment', foreignKey: 'requestPaymentId' });

db.xnumPayment.hasOne(db.paymentRequest, { as: 'requestPayment', foreignKey: 'requestPaymentId' });

db.user.hasMany(db.xnum);

db.tile.belongsTo(db.map);
db.map.hasMany(db.tile, { as: 'tiles' });

db.mapPulse.belongsTo(db.user);
db.mapPulse.belongsTo(db.map);

db.map.hasMany(db.mapPulse, { as: 'pulse' });

db.xnum.belongsTo(db.map);
db.map.hasMany(db.xnum);

db.adv.belongsTo(db.user);
db.adv.belongsTo(db.map);
db.map.hasMany(db.adv, { as: 'advs' });
db.user.hasMany(db.adv);

db.prodimg.belongsTo(db.merch);
db.prodoptioncat.belongsTo(db.merch);
db.prodoption.belongsTo(db.prodoptioncat);
db.proddesc.belongsTo(db.merch);

db.user.hasMany(db.conquering, { as: 'conqueredMaps' });
db.conquering.belongsTo(db.user);
db.conquering.belongsTo(db.map);

//////////////////////////////

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;