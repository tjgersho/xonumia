require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('StoreController', ['Global', 'Cart', function(Global, Cart){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


self.cart = Cart;
console.log('Store Controller cart ');
console.log(self.cart);

self.cart.describe();


//self.cart.addItem(2, 'Test2', 12.92, 1, {'option': 'CoolOption111'});
//self.cart.addItem(2, 'Test2', 12.92, 1, {'option': 'CoolOption111'});



self.merchPanel = true;
self.sponsorPanel = false;

self.activatePanel = function(panel){
	switch (panel){
		case 'merch':	
		self.merchPanel = true;
		self.sponsorPanel = false;
		break;
		case 'sponsor':
		self.merchPanel = false;
		self.sponsorPanel = true;
		break;
	}
};

}]);


		

}; 