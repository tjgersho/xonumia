require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('CheckoutController', ['Global', 'Cart', function(Global, Cart){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


self.cart = Cart;



 /////////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////Checkout Code/////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



self.billing_first_name = '';
self.billing_last_name = '';
self.billing_address1 = '';
self.billing_address2 = '';
self.billing_city = '';
self.billing_state = '';
self.billing_postal = '';
self.billing_country = 'USA';
self.billing_phone = '';
self.billing_email = '';

self.shipping_first_name = '';
self.shipping_last_name = '';
self.shipping_address1 = '';
self.shipping_address2 = '';
self.shipping_city = '';
self.shipping_state = '';
self.shipping_postal = '';
self.shipping_country = 'USA';
self.shipping_phone = '';
self.shipping_email = '';

self.shippingandbillingsame = function(){
if(self.shippingsameasbilling){
self.shipping_first_name = self.billing_first_name;
self.shipping_last_name = self.billing_last_name;
self.shipping_address1 = self.billing_address1;
self.shipping_address2 = self.billing_address2;
self.shipping_city = self.billing_city;
self.shipping_state = self.billing_state;
self.shipping_postal = self.billing_postal;
self.shipping_country = self.billing_country;
self.shipping_phone = self.billing_phone;
self.shipping_email = self.billing_email;
}else{
self.shipping_first_name = '';
self.shipping_last_name = '';
self.shipping_address1 = '';
self.shipping_address2 = '';
self.shipping_city = '';
self.shipping_state = '';
self.shipping_postal = '';
self.shipping_country = 'USA';
self.shipping_phone = '';
self.shipping_email = '';
}
 self.shippingStateChange();
};

 self.shippingStateChange = function(){
	 if(self.shippingsameasbilling){
		 self.shipping_state = self.billing_state;
	 }
	if( !( self.shipping_state ==='CO' || self.shipping_state === 'COLORADO' || self.shipping_state === 'co' || self.shipping_state === 'Co' || self.shipping_state === 'cO'  || self.shipping_state === 'Colorado' || self.shipping_state === 'colorado')){
		//alert("SHipping is not Colorado");
		console.log("CART ---");
		console.log(self.cart);
			self.cart.isoutofState = true;
		
	} else {
		self.cart.isoutofState = false;
	
	}
	
 };

/**
 * Overwrites obj1s values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
		  
	
		   
		                				  
				  
		  self.checkout = function(evnt_id){
		  
			 $('#CheckOutModal1').modal('toggle');
 			 
		 };
		  
		       function getFormData($form){
				var unindexed_array = $form.serializeArray();
				var indexed_array = {};

				$.map(unindexed_array, function(n, i){
					indexed_array[n['name']] = n['value'];
				});

				return indexed_array;
			}
		
			 
        self.formokay1 = function(){
          return true;
             var uF = isEmpty(self.userFile);
             var nT = isEmpty(self.newBlogpost);
             
              if(!uF || !nT){
              	return true;
              }else{
              	return false;
              }   
          };
		  
    self.paymentURL ='';
          
     self.submitcheckoutform1 = function(){
		 

     $('#CheckOutModal1').modal('hide');
     $('#CheckOutModal2').modal('show');
		

     };
     
      self.formokay2 = function(){
             var uF = isEmpty(self.userFile);
             var nT = isEmpty(self.newBlogpost);
             
              if(!uF || !nT){
              	return true;
              }else{
              	return false;
              }   
        };
     
	 self.changepayment = function(){
		 
		 $('#CheckOutModal2').modal('toggle');
		 self.payit();
    
		 
	 };
		  
     self.submitcheckoutform2 = function(){
     
     self.ssl_amount = self.cart.getTotalTotal();
     
    $('#submitform2loading').show();
    
   
    var ccexp = $('#ccexpiry').val();
    ccexp = ccexp.replace(/\s/g, '');
    ccexp = ccexp.replace(/\//g, '');
     $('#ccexpiry').val(ccexp);
    


    var ccnum = $('#ccnumber').val();
    ccnum =  ccnum.replace(/\s/g, '');
         $('#ssl_card_number').val(ccnum);
         
     
	var $form = $("#checkoutForm1");	
        var data = getFormData($form);
        console.log('Form 1 Data');
	console.log(data);
        
     var formdata = $("#checkoutForm2");
     var params = getFormData(formdata);
    console.log(params);
    params = merge_options(params, data);
    console.log('params');
	//console.log(params);	 
	
	var ajaxornot = true;
	
	if(ajaxornot){
    
      $http.post('server/api/converge/', params).then(function(resp){
      console.log('Converge Resp ');
      console.log(resp);
      
      
       var checkout =  params;
       checkout.ssl_card_number = null;
       checkout.ssl_exp_date = null;
	checkout.ssl_cvv2cvc2 = null;

       console.log('Cart');
       
      console.log(self.cart);
      
      console.log(self.cart.items.length);
      checkout.num_cart_items = self.cart.items.length;
      
      for(var j=0; j<self.cart.items.length; j++){
     	 checkout["item_number"+(j+1)] = self.cart.items[j].sku;
         checkout["item_name"+(j+1)] = self.cart.items[j].name;
         checkout["quantity"+(j+1)] = self.cart.items[j].quantity;
         var i=0;
         for (var k in self.cart.items[j].options) {
          if (self.cart.items[j].options.hasOwnProperty(k)) {
       		   checkout["option_name"+(i+1)+"_"+(j+1)] = self.cart.items[j].options[k][0];
       		   i++;
    	      }
    	    
            }

      }
      checkout.cart
      checkout.txn_id = resp.data.message.txn_id;
      console.log(checkout);
      
     self.cart.clearItems();
      $('#submitform2loading').hide();
      $('#CheckOutModal2').modal('toggle');
      self.shipping_first_name = '';
	self.shipping_last_name = '';
	self.shipping_address1 = '';
	self.shipping_address2 = '';
	self.shipping_city = '';
	self.shipping_state = '';
	self.shipping_postal = '';
	self.shipping_country = '';
	self.shipping_phone = '';
	self.shipping_email = '';
	self.billing_first_name = '';
	self.billing_last_name = '';
	self.billing_address1 = '';
	self.billing_address2 = '';
	self.billing_city = '';
	self.billing_state = '';
	self.billing_postal = '';
	self.billing_country = '';
	self.billing_phone = '';
	self.billing_email = '';
 	$('#ccexpiry').val('');
	$('#ccnumber').val('');
        $('#ssl_card_number').val('');
        $('#nameoncard').val('');
        $('#ssl_cvv2cv').val('');
	self.cvc = '';
         

     
    
       var form = document.createElement("form");
  		  form.setAttribute("method", "post");
   		 form.setAttribute("action", "https://paradigmcycle.com/paysuccess.php");

   		 for(var key in checkout) {
    		   if(checkout.hasOwnProperty(key)) {
        		    var hiddenField = document.createElement("input");
         		  hiddenField.setAttribute("type", "hidden");
           		 hiddenField.setAttribute("name", key);
          		 hiddenField.setAttribute("value", checkout[key]);

           		 form.appendChild(hiddenField);
         		}
   		 }

   		 document.body.appendChild(form);
   		 form.submit();	 
                 form.parentNode.removeChild(form);

      },function(err){
      console.log('Converge ERR Resp ');
      console.log(err);
      $('#CheckOutModal2').modal('toggle');
         self.checkouterr = err.data.message;
      $('#CheckOutModalERR').modal('toggle');

       $('#submitform2loading').hide();
      
      });

	 }else{


    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
  
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://paradigmcycle.com/server/api/converge/");

    for(var key in params) {
       if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
           hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
           hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();	 
    }
     
     };
  /////////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////Checkout Code/////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


   
}]);


		

}; 