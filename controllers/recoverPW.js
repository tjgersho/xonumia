var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');

module.exports.controller = function(app) {

app.post('/api/v1/recoverPW', [bodyParser.json()], function(req,res){
  var body = _.pick(req.body, 'username_or_email');
  console.log('RECOVERY PW SERVER SIDE ENDPOINT');

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 var where_obj = {};

  if(re.test(body.username_or_email)){
   where_obj.where = {email: body.username_or_email};
  }else{
    where_obj.where = {username: body.username_or_email};
  }


	
db.user.find(where_obj).then(function(user){
	var tmp_pswd  = Math.floor((Math.random() * 100000) + 10000).toString(); 
       user.update({password: tmp_pswd}).then(function(user){
	 
         var message = `
 		<html>
 		 <head>
 		  <title>Reset Password</title>
 		 </head>
 		 <body>
 		   <p><br /><br />Thanks for being a part of xonumia.io, &nbsp; `+
 		user.username + 
 		`&nbsp; we really appreciate your involvement, and we hope you have fun chaseing the xBits and xNum. 
               Don't forget to try out the builder and build your own mazes!<br />
 		Click the link below to create your new password. <br />
 		<a href='https://xonumia.io/changepassword/` + user.username  + `/code/`+ tmp_pswd +`'>Change Password</a></br ><br />
 		If the link is not working copy and paste this link into your browser: <br />
 			https://xonumia.io/changepassword/` + user.username  + `/code/`+ tmp_pswd +`</p><br /><br />
 	 	</body>
 	    </html>`;
    
        	var mailGun_api_key = 'key-4bd8a68cf8b33f0459ed54db9ad85eea';
		var domain = 'xonumia.com';
		var mailgun = require('mailgun-js')({apiKey: mailGun_api_key, domain: domain});
 
	   var emailObj = {
  		from: 'Xonumia <xonumia@xonumia.com>',
  		to: user.email,
  		subject: 'Password Reset',
  		text: message,
 		html: message
	   };
 
	   mailgun.messages().send(emailObj, function (error, body) {
 		 	console.log('MailGun Body');
  			console.log(body);
  			res.json(body);
		});

       },function(err){
	   console.log('UPDATE FAILED');
          res.status(500).json(err);
	});
    
  }, function(e) {
	console.log('Could not get User from entered data');
       res.status(500).json(e);
  });
 
  
});



};

