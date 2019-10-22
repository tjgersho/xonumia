require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('merchStorePanel', ['$window', '$state', '$http', 'Global', 'User', 'Merch', 'Cart', function($window, $state, $http, Global, User, Merch, Cart){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/merchstore';
   directiveObj.controllerAs = 'merchstoreCtrl';

   directiveObj.controller = function(){
   	    var self = this;

          Merch.getStore().then(function(resp){
               self.store = resp;
               console.log('Merch Get Store');
               console.log(resp);

          },function(err){

            console.log('Merch Get StoreERR');
               console.log(err);
          });

	
   		console.log('$state in the merchStorePanel', $state);

self.cart = Cart;
console.log('CART?');
console.log(self.cart);
self.cart.codeApplied = false;

 self.cart.applyDiscountCode = function(){
	
	
	if(!self.cart.codeApplied){
	
		$http.post('server/api/redeemcouponcode/', {code: self.cart.discountCode}).then(function(resp){
			//console.log('Test Angular Get Call in The Shopping Cart JS');
			//console.log(resp);
				              
	                
			if(resp.data.message.wholesale){
			  //then set discount to not applied and update all pricing to wholesale.
			  self.cart.codeApplied = false;
			  self.cart.discount = 1
			  
			  self.cart.iswholesale = true;
			    //so go through the cart model and update unit pricing, and then go through the store model and update the pricing.
			    
			  for(var i=0; i< self.store.products.length; i++){

			  self.store.products[i].price =   self.store.products[i].wholesaleprice;
			  
			  }
			  
			  if(self.cart.items.length > 0){
			   /////clear cart/////
			   self.cart.clearItems();
			   
			  alert('Sorry -- The items currently in your cart have to be removed to get wholesale pricing. \n\n You now have to re-load your cart. \n\n For future reference click the wholesale link at the bottom of the page and first enter the code and then checkout.');
			 
			  
			  }
			
			  
			  
			//  $('#discountContainer').css('display', 'none');
			 // $('#discountContainer').hide();
			  
			}else{
			self.cart.codeApplied = true;
			self.cart.iswholesale = false;
			// console.log(resp.message);
			 self.cart.discount = resp.data.message.discountamount;
			//$('#discountContainer').css('display', 'none');

			}
			
	                
		},function(err){
			//console.log('Test Angular Get Call in The Shopping Cart JS ERRRR');
			//console.log(err);
			self.discountcodeerr = err.data.message;
		});
		
	}
	
};
 	
self.optionsChanged = function(e, prodSku){
	//console.log(prodSku);
	//console.log(e.target);
	
};
 


};

  

return directiveObj;
}]);


};