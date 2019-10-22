require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('PaymentfailController', ['$state', 'Global', 'Cart', '$http', 'User', function($state, Global, Cart, $http, User){

var self = this;

self.cart = Cart;

self.receipt =  self.cart.printTransaction();

//self.cart.clearItems();

console.log("Cart");
console.log(self.cart);

self.backtoStore = function(){
 console.log('Back to Store');
  $state.go('store');
};
  




}]);


		

}; 