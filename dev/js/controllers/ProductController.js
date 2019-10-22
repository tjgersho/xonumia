require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('ProductController', ['$state', 'Global', 'Cart',  'Merch', function($state, Global, Cart, Merch){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;

console.log('IN PRODUCT CONTROLLER');
console.log('STATE', $state);

self.cart = Cart;
console.log('Store Controller cart ');
console.log(self.cart);

self.cart.describe();

 Merch.getProduct($state.params.id).then(function(resp){
               self.product = resp;
               console.log('Merch Get Produt');
               console.log(resp);

          },function(err){

            console.log('Merch Get StoreERR');
               console.log(err);
          });




self.backtoStore = function(){
 console.log('Back to Store');
  $state.go('store');
};
  


  }]);


		

}; 