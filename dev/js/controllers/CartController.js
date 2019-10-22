require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('CartController', ['$state', 'Global', 'Cart', '$http', 'User', function($state, Global, Cart, $http, User){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;

self.user = User;
self.cart = Cart;


console.log("Cart");
console.log(self.cart);

self.backtoStore = function(){
 console.log('Back to Store');
  $state.go('store');
};
  
   

 paypal.Button.render({
	env: 'sandbox', // Specify 'sandbox' for the test environment
	locale: 'en_US',

        style: {
            size: 'small',
            color: 'blue',
            shape: 'rect'
        },

	 client: {
            sandbox:    'ARcdK5Gvlp2L6LT0CNHu1Ybcg6jFhfy2S-Qox3IIHwQItAI7K5BO_w1kV8Ky7AwYVd2-nWt8y4dwTb0_'
            //production: 'xxxxxxxxx'
        },

	payment: function(resolve, reject) {
	// Set up the payment here, when the buyer clicks on the button
            var env    = this.props.env;
            var client = this.props.client;

	     console.log('SEttuing up the Cart!');
            
             var CREATE_PAYMENT_URL = 'api/v1/paypal/create-payment';
                
         
              var transactionObj = self.cart.getPaypalTransactionObject();
           	console.log('TransAction Object gotten from cart object');
		console.log(transactionObj);
   
             $http.post(CREATE_PAYMENT_URL, {transObj: transactionObj}).then(function(resp){
	            console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS");
	            console.log(resp);
                   resolve(resp.data.paymentID);

             },function(err){

  	            console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS ERR");
	            console.log(err);
			reject(err); 

             });

       
        },

       commit: true, // Optional: show a 'Pay Now' button in the checkout flow
	onAuthorize: function(data) {
	// Execute the payment here, when the buyer approves the transaction
	     
        var EXECUTE_PAYMENT_URL = 'api/v1/paypal/execute-payment';


		 $http.post(EXECUTE_PAYMENT_URL, { paymentID: data.paymentID, payerID: data.payerID }).then(function(data){
	           
	            console.log('YES SERVER SIDE PAYPAL REST API INTEGRATED B!');
		     console.log(data);
                   $state.go('play');

               },function(err){

  	            console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS ERR");
	            console.log(err);
			
               });

	  },

        onError: function(err) {
            // Show an error page here, when an error occurs
            console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS ERR");
	     console.log(err);

        }

   }, '#paypal-button');



   self.coinbaseIframeEmbedCode = '';

   self.getcoinbasebuttonandclick = function(){

	self.cart.setCoinBaseVerificationCode(Math.random()*1000 + "cross"+Math.random()*1000+"verification");
	console.log('Get CoinBase button and click');
      $http.post('api/v1/coinbase/getButton', self.cart.coinbasegitbuttonObject(), {headers:{auth:User.token}}).then(function(resp){
      			console.log('Get Button Resp');
			console.log(resp);
			console.log('embed_code');
			console.log(resp.data.embed_code)
			var iframeSrc = 'https://www.coinbase.com/checkouts/' + resp.data.embed_code + '/inline';
			var coinbaseIframe = document.getElementById('coinbase_inline_iframe');
			coinbaseIframe.height = self.cart.items.length > 0 ? '650px' : '450px';  //Collect Address ads iFrame Height...
			coinbaseIframe.src = iframeSrc;
			$('#coinbaseIframe').modal({backdrop: 'static', keyboard: false});

			$('#coinbaseIframe').modal('show');
	
			self.coinbaseIframeEmbedCode = resp.data.embed_code;
			

	},function(err){

		console.log('Get button Err');
		console.log(err);

	});
      
   };

  
  // Add an event listener for messages posted to this window
  window.addEventListener('message', receiveMessage, false);

  // Define the message handler function
  function receiveMessage(event) {

    // Make sure the message posted to this window is from Coinbase
    if (event.origin == 'https://www.coinbase.com') {
      var event_type = event.data.split('|')[0];     // "coinbase_payment_complete"
      var event_id   = event.data.split('|')[1];     // ID for this payment type
	console.log('EmbedCodes');
	console.log(event_id);
	console.log(self.coinbaseIframeEmbedCode);
        if (event_type == 'coinbase_payment_complete' && self.coinbaseIframeEmbedCode === event_id) {

		var verifyAndLogObj = {
			verificationCode: self.cart.coinbaseVerificationCode,
			userId: User.id,
			method: 0,
			status: 0,
			transnum: '',
			cart: self.cart.printTransaction()
		};

		
              $http.post('api/v1/coinbase/verifyTx', verifyAndLogObj, {headers:{auth:User.token}}).then(function(resp){

			console.log('Resp from Verify TX');
			console.log(resp);
			//high level of confidence in the transaction
				

				$('#coinbaseIframe').modal('hide');
				$('#coinbaseIframe').on('hidden.bs.modal', function () {

                                $state.go('paymentsuccess');
				});

			  
		},function(err){

			console.log('Resp from Verify TX ERR');
			console.log(err);

			//lower level of confidence in the transaction!!..
			$('#coinbaseIframe').modal('hide');
				$('#coinbaseIframe').on('hidden.bs.modal', function () {

                                $state.go('paymentsuccess');
				});




		});

      }
      else if (event_type == 'coinbase_payment_mispaid') {
              
                $state.go('paymentfail');

      }
      else if (event_type == 'coinbase_payment_expired') {
     		 $state.go('store');
      }
      else {
        // Do something else, or ignore
		      }
    }
  }






}]);


		

}; 