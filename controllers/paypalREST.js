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

var paypal = require('paypal-rest-sdk');

module.exports.controller = function(app) {



/* Copyright 2016 PayPal */

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'ARcdK5Gvlp2L6LT0CNHu1Ybcg6jFhfy2S-Qox3IIHwQItAI7K5BO_w1kV8Ky7AwYVd2-nWt8y4dwTb0_',
    'client_secret': 'EOD1DQV7tClAUJZQXs440h2P7NMvw_uCEdIWaAkqrGEYrG2YlbpW-xVoggWqly4bjXGd_6m2eQDI5mF_'
});


app.post('/api/v1/paypal/create-payment', [bodyParser.json()], function(req, res){
console.log('YOU ARE HERE');
console.log(req.body);
console.log('--------------------------');
var create_payment_json = _.pick(req.body, 'transObj');


paypal.payment.create(create_payment_json.transObj, function (error, payment) {
    if (error) {
	 console.log(error.response);
        throw error;
    } else {
        console.log("Create Payment Response");
	 console.log(payment);
        console.log(JSON.stringify(payment, null, 2));
	console.log('----');
        console.log({paymentID: payment.id});
	 res.json({paymentID: payment.id});

    }

});


});



app.post('/api/v1/paypal/execute-payment', [bodyParser.json()], function(req, res){
       console.log(req.body);
	var body = _.pick(req.body, 'paymentID', 'payerID');
	console.log('BODY in execute-payment');
	console.log(body);

	execute_payment_json = { 
              "payer_id": body.payerID
        }; 


	paypal.payment.execute(body.paymentID, execute_payment_json, function (error, payment) { 
        if (error) { 
           console.log(error.response); 
            throw error; 
         } else { 
           console.log("Get Payment Response"); 
           console.log(JSON.stringify(payment)); 
	    res.json(payment);
         } 
       }); 
});



};

