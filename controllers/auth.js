var db = require('../db.js');
var middleware = require('../middleware.js')(db);
//var _ = require('underscore');
//var cryptojs = require('crypto-js');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

  
app.get('/api/v1/auth',  [bodyParser.json(), middleware.adminOnly], function(req, res){

   var user = req.user;

             res.status(200).json(user.toPublicJSON());

});




};