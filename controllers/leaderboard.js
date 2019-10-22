var lb = require('../lib/leaderboard.js');
var leaderboard = new lb();



var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

app.get('/api/v1/leaderboard', middleware.requireAuthentication, function(req,res){

leaderboard.getAllUsers();

var leaderboardArray = {

	xbitLeaderboard: leaderboard.getXbitOrderedArray(),

	xnumLeaderboard: leaderboard.getXnumOrderedArray()

};


res.json(leaderboardArray);

});


};