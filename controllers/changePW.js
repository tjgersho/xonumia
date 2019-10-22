var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');

module.exports.controller = function(app) {

app.post('/api/v1/changePW', [middleware.requireAuthentication, bodyParser.json()], function(req,res){
    var body = _.pick(req.body, 'username', 'password1', 'password2');
			
        console.log('CHANGE PW SERVER SIDE ENDPOINT');
	 console.log(req.user);
        
       req.user.update({password: body.password1}).then(function(user){
	    res.status(200).json(user);

        },function(err){

	   console.log('UPDATE FAILED');
          res.status(500).json(err);

	});
    

});



};
