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

var Client = require('coinbase').Client;

module.exports.controller = function(app) {




function logMerchSale(sale){
var merchSale = JSON.parse(sale);
if(merchSale.cart.items.length>0 && !merchSale.cart.hasAdv || merchSale.cart.items.length>1){
	merchSale.amount = merchSale.cart.amount;
	merchSale.cart = JSON.stringify(merchSale.cart);

      db.merchSale.create(merchSale);

}
}

function logAdvSale(sale){
	var advSale = JSON.parse(sale);

	console.log('LogAdvSale');
	console.log(advSale);
	console.log(advSale.cart.hasAdv);
  if(advSale.cart.hasAdv){

	var advPurchaseObj = advSale.cart.adv;

 	 db.advPurchase.create(advPurchaseObj);

  }
}


 
var client = new Client({'apiKey': 'XXXX', 'apiSecret': 'XXXXXXXX'});

app.post('/api/v1/coinbase/createWallet', [middleware.adminOnly, bodyParser.json()], function(req,res){

	client.createAccount({'name': 'New Wallet'}, function(err, acct) {
             if(!!err){
		console.log('ERROR CREATING WALLET');
		console.log(err);
		res.status(400).json(err);

             }else{
 		 console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
		res.json(acct);
 		}
	});

});



app.post('/api/v1/coinbase/getAccounts', [middleware.adminOnly, bodyParser.json()], function(req,res){
console.log('HEY GET ACCOUNTS');
console.log(client);

client.getAccounts({}, function(err, accounts) {

 // accounts.forEach(function(acct) {
 //   console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
	
   // acct.getTransactions(null, function(err, txns) {
   //  txns.forEach(function(txn) {
   //     console.log('txn: ' + txn.id);
   //   });
   // });
  //});

res.json(accounts);
});

});


function getWalletById(id){

return new Promise(function(resolve, reject){
	client.getAccount(id, function(err, account) {
		resolve(account);
	});
});

}

app.post('/api/v1/coinbase/getAccount', [middleware.adminOnly, bodyParser.json()], function(req,res){
	console.log('HEY GET ACCOUNT');
	var body = _.pick(req.body, id);
	getWalletById(body.id).then(function(acct){
	       console.log('Got the accunt');
		console.log(acct);
		res.json(acct);

	},function(err){
              console.log('Did not find the account');
		console.log(err);
 		res.status('400').json(err);
	});

});


app.post('/api/v1/coinbase/sendMoney', [middleware.adminOnly, bodyParser.json()],  function(req, res){

    client.getAccount("5bf03711-47c0-553d-9f32-71a1d937e5eb", function(err, primaryAccount) {
	console.log('Primary Account ');
	console.log(primaryAccount.name);
 	getWalletById('a3b6e2a1-83d3-53bf-9c18-1743885058de').then(function(account){
         console.log('Get Wallet By Id Response');
	  console.log(account.name);

  	 account.createAddress(null, function(err, address) {
   	  // Send coins to the new account from your primary account:
	    console.log('Create Address Address');
	    console.log(address);

 	    primaryAccount.sendMoney({'to': address.address,
                              'amount': '0.0001',
                              'currency': 'BTC',
                              'description': 'For being awesome!'}, function(err, tx) {
		if(!!err){
			console.log('Transaction Err');	
			console.log(err);

              }else{
			console.log('Transaction Tx');
			console.log(tx);
			res.json(tx);
              }
     	             
   	   });
 	});
      },function(err){
		console.log('Did not find the account');
		console.log(err);
          });
    });


});

app.post('/api/v1/coinbase/getButton', [middleware.requireAuthentication, bodyParser.json()], function(req,res){
	console.log('HEY GET Button');
	
     var coinButtonObj = req.body;

	console.log(coinButtonObj);
	client.createCheckout(coinButtonObj.json, function(err, checkout) {
		if(!!err){
			console.log('Get Button Err');	
			console.log(err);
			 res.status(400).json(err);


              }else{
			console.log('Checkout Obj');
			console.log(checkout);
			res.json(checkout);
              }

                   
      });
});


app.post('/api/v1/coinbase/verifyTx', [middleware.requireAuthentication, bodyParser.json()], function(req,res){
	console.log('HEY Verify Tx');
	
	
     var vcode = _.pick(req.body, 'verificationCode');
		console.log(vcode);

     var sale = _.pick(req.body, 'userId', 'method', 'status', 'transnum', 'cart');

		console.log(sale);
		console.log(sale.cart);
	sale.verificationCode = vcode.verificationCode;
		
db.coinbaseNotification.find({where:{verificationCode: vcode.verificationCode}}).then(function(notif){
	   console.log('FOUND ORDER');
	   console.log(notif);
	
	if(notif !== null){
		//Found so set Confidence level in transaction as High....
	    sale.transum = notif.transId;
	    sale.status = 1;
           sale.cart.adv.status = 1;
	    sale.cart.adv.method = 0;
	    sale.cart.adv.transId = notif.transId;

	    console.log('Customer Info');
	    console.log(notif.customerInfo);
	
	   //insert into transaction

		logMerchSale(JSON.stringify(sale));
		logAdvSale(JSON.stringify(sale));
		

	   notif.update({verified: 1}).then(function(notification){

 						res.json(notification);

		},function(err){
			console.log('Notification UPdate Failed');
			res.json(notif);
		});
         


	}else{

	         logMerchSale(JSON.stringify(sale));
		  logAdvSale(JSON.stringify(sale));

           	  res.status(400).json('Notification Not Found');

       }
	    

	},function(err){
		console.log('Could not find transactions in the coinbase notifications..');
		 console.log(err);

		  logMerchSale(JSON.stringify(sale));
		  logAdvSale(JSON.stringify(sale));

           	  res.status(400).json(err);

	});         
});



app.post('/api/v1/coinbase/webhook', [bodyParser.json()], function(req,res){
	console.log('WEB HOOK ENDPOINT');
	console.log(req.body);
	var notification = {};

       notification.amount =  req.body.data.amount.amount;
	notification.notificationId = req.body.id;
	notification.type = req.body.type;
	notification.name = req.body.data.name;
	notification.transId = req.body.data.transaction.id;
	notification.transType = req.body.data.type;
	notification.verificationCode = req.body.data.metadata.verificationCode;
	notification.cartData = JSON.stringify(req.body.data.metadata);
	notification.customerInfo = JSON.stringify(req.body.data.customer_info);

	console.log('NOTIFICATION OBJECT...');
	console.log(notification);

	if(!!notification.verificationCode){
	    db.coinbaseNotification.create(notification);
	}

	res.json('Got it, Thanks!');
});

// refresh the account
//client.getAccount(primaryAccount.id, function(err, acct) {
//  console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
//});


};

