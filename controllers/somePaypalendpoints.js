var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');

var os = require('os');
var uuid = require('uuid');
var path = require('path');
var fs = require('fs');

var querystring = require('querystring');

var https = require('https');
var request = require('request');

module.exports.controller = function(app) {

function  goToPayPalPaymentSuccess(req,res){
console.log('Return from Paypal');

var purchaseID = req.query.tx;
var atoken = '_xQN3dDce9daGNpIFTOFs3ATAj9VFXYmMLDo2j0dieqOFIMwmtoU1QeTXgC';

var postData = {
  'cmd' : '_notify-synch',
  'at' :  atoken,
   'tx' : purchaseID
};


request.post({url:'https://www.sandbox.paypal.com/cgi-bin/webscr', form: postData}, function(err, httpResponse, body){ 
  if(err){
    console.log("OH SHIT");
    console.log(err);
  }
  if(body.substring(0,7) === 'SUCCESS'){
    body = body.substring(8);
    body = body.split("\n");

    var saleElems = [];
    for (var i=0; i<body.length; i++){
      saleElems[i] = body[i].split('=');
    }
  
    saleElems.pop();
    var saleJson = {};
    for (var i=0; i<saleElems.length; i++){
      saleJson[saleElems[i][0]] = saleElems[i][1];
    }

    console.log(saleJson);
    
 }

	

});


res.render('index');

}







function postPayPalPaymentSuccess(req, res, next){
  var body = _.pick(req.body, '');
  console.log('paypalpaymentsuccess');

   fs.readFile('./emailTemplates/paymentReceipt.html', 'utf8', function (err,data) {
          if (err) {
               return console.log(err);
          }
            console.log(data);
		var message =  data;
		message = message.replace(/{!{username}!}/g, 'tjgersho');

           	var mailGun_api_key = 'key-4bd8a68cf8b33f0459ed54db9ad85eea';
		var domain = 'xonumia.com';
		var mailgun = require('mailgun-js')({apiKey: mailGun_api_key, domain: domain});

 
	   var emailObj = {
  		from: 'Xonumia <xonumia@xonumia.com>',
  		to: 'travis.g@paradigmmotion.com',
  		subject: 'Payment Success',
  		text: message,
 		html: message
	   };
 
	        mailgun.messages().send(emailObj, function (error, body) {
 		 	console.log('MailGun Body');
  			console.log(body);
		     ///POST SALE TO DATABASE !!//
  			return next();
		});

    });
}




//app.post('/paypalpaymentsuccess', [bodyParser.json()], postPayPalPaymentSuccess, goToPayPalPaymentSuccess);

app.get('/paypalpaymentsuccess', goToPayPalPaymentSuccess);

app.get('/api/v1/paypalpaymentdetails', function(req, res){
res.json('DATA BASE INFORMATION');

});




};

