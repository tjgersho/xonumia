//Global Variables Service

require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){

angular.module('Services').factory('Cart', ['$http', '$q', '$localStorage', 'Global', 'User', function($http, $q, $localStorage,  Global, User){



//----------------------------------------------------------------
// shopping cart
//
var service = {};

function cartItem(id, sku, name, price, quantity, options) {
    console.log('CartItem Object');
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.options = options;
    console.log(this);
}

class AdvItem{
     constructor(advId, locX, locY, width, height, mapId){
	this.advId = advId;
       this.locX = locX;
       this.locY = locY;
       this.width = width;
       this.height = height;
	this.aspect = 0;
	this.img = "sponsorshipavailable.png";
	this.active = true;
	this.available = true;
	this.mapId = mapId;
	this.link = '';
	this.hasLink = false;
	this.rate=0.1;
	this.runTime = 14;
      }
	
     get area() {
        return this.width * this.height;
     }

     calculateCost() {
	   if(this.hasLink){
		return 2*this.runTime*this.area*this.rate;
          }else{
	       return this.runTime*this.area*this.rate;
	  }
	}
    
}


function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

class ShoppingCart{

    constructor() {
            console.log('Cart CONSTRUCTOR');
	     console.log('Cart');
	     console.log('User Obj..');
		console.log(User);
            this.cartName = 'XONUMIA CART';
	     this.cartId = '';
            this.clearCart = false;
            this.checkoutParameters = {};
            this.items = [];
            this.adv = [];
            this.codeApplied = false;
            this.discount = 1;
            this.discountCode = '';
            this.iswholesale = false;
            this.ispickup = false;
            this.isoutofState = false;
	     this.coinbaseVerificationCode = '';
            $localStorage.cart = {};
        
            $localStorage.cart.items = [];
            // load items from local storage when initializing
   
            // save items to local storage when unloading
            
    }
    getCartId(){
	this.cartId = 'XO-CART-' + User.id; 
	return this.cartId;
		
    }
    loadItems() {
        console.log('LocalStorage on load Items');
        console.log($localStorage);
        this.items = ($localStorage.cart.items !== null  &&  $localStorage.cart.items.length > 0) ? $localStorage.cart.items : [];
        this.adv = ($localStorage.cart.adv !== null) ? $localStorage.cart.adv : {};
        
        console.log('This.items..', this.items, typeof(this.items));
    }

    saveItems(){
            console.log(this.items);
            console.log('save Items local Storage ');
            console.log($localStorage);
            $localStorage.cart = {};
            $localStorage.cart.items = this.items;
            $localStorage.cart.adv = this.adv;
           
        }

     addAdv(advId, locX, locY, width, height, mapId) {
            var  adv = new AdvItem(advId, locX, locY, width, height, mapId);
                    console.log("nEw AdvItem..");
                    console.log(adv);
                    this.adv = adv;
        }
      removeAdv(){
		this.adv = [];
	}

    addItem(id, sku, name, price, quantity, options) {

           
            var qty = parseInt(quantity);
            console.log('qty', quantity);
        
            console.log(qty);
            var item;
            if (qty !== 0) {
         
                // update quantity for existing item
                var found = false;
                for (var i = 0; i < this.items.length && !found; i++) {
                    item = this.items[i];
               
                    if (item.sku == sku && JSON.stringify(item.options) === JSON.stringify(options)) {
                        found = true;
                        
                        item.quantity = parseInt(item.quantity);
                        
                        item.quantity = item.quantity + qty;
                        if (item.quantity <= 0) {
                            this.items.splice(i, 1);
                        }
                    }
                }

                // new item, add now
                if (!found) {
                    item = new cartItem(id, sku, name, price, qty, options);
                    console.log("nEw Item..");
                    console.log(item);
                    this.items.push(item);
                    console.log(this.items);
                }

                // save changes
                this.saveItems();
                
                
                // if($(e.target).attr('data-cart') !== 'plusUp' && $(e.target).attr('data-cart') !== 'minusDown'){
                // $(e.target).html('Added');
                // setTimeout(function(){
                // $(e.target).html('Add to Cart');
                // },1000);
                // }
                
            }
            
        }

	getTotalItemsOnlyPrice(){
	    var total = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.sku !== null) {
                    total += item.quantity * item.price;
                }
            }
	     
            if(this.discount  < 1.0){
		total = total * this.discount;
	     }

            return parseFloat(total);

	}

       getTax () {
            if(!this.iswholesale){
               
                   if(this.isoutofState){
                         return 0.00;
                   }else{
                        return parseFloat((this.getTotalItemsOnlyPrice()*0.04));
                   }
                
            }else{
             return 0.00;
            }
                
        }
        getShipping() {

           var total = 0;
              
            if(!this.iswholesale || !this.ispickup){
              
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.sku !== null) {
                if(item.sku === 'XO1' || item.sku === 'XO2' || item.sku === 'XO3'){
                    total += 0.01 * item.quantity + 0.1;
                    }else{
                    total += 0.01 * item.quantity + 0.1;
                    }
                  }
                
               }
            }   
            return parseFloat(total);
         
        }

	 getHandling(){
		return parseFloat(0.00);
         }

        getShippingAndHandling(){
	     var total =  (this.getHandling() + this.getShipping());
            return total;
        }

        getTotalPrice() {
            var total = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.sku !== null) {
                    total += item.quantity * item.price;
                }
            }
	      if(this.adv.advId > 0){
		total = total + this.adv.calculateCost(this.adv.height * this.adv.width);
	     }
            if(this.discount  < 1.0){
		total = total * this.discount;
	       }
	      
            return parseFloat(total);

        }
        getTotalTotal() {
		var total =  (this.getTotalPrice() +this.getShipping() +this.getTax());
            return total;
        }
        getTotalCount() {
            var count = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.sku !== null) {
                    count += item.quantity;
                }
            }
	     if(this.adv.advId > 0){
		count +=  1;
	     }

            return count;
        }
        clearItems () {
            this.items = [];
	     this.adv = [];
            this.saveItems();
        }
        addCheckoutParameters (serviceName, merchantID, options) {

            // check parameters
            if (serviceName !== "PayPal" && serviceName !== "Google") {
                throw "serviceName must be 'PayPal' or 'Google'.";
            }
            if (merchantID === null) {
                throw "A merchantID is required in order to checkout.";
            }

            // save parameters
            this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
        }

        checkout(serviceName) {

            // select serviceName if we have to
            if (serviceName === null) {
                var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
                serviceName = p.serviceName;
            }

            // sanity
            if (serviceName === null) {
                throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
            }

            // go to work
            var parms = this.checkoutParameters[serviceName];
            if (parms === null) {
                throw "Cannot get checkout parameters for '" + serviceName + "'.";
            }
            switch (parms.serviceName) {
                case "PayPal":
                    this.checkoutPayPal(parms);
                    break;
                case "Google":
                    this.checkoutGoogle(parms);
                    break;
                default:
                    throw "Unknown checkout service: " + parms.serviceName;
            }
        }

        // // check out using PayPal
        // // for details see:
        // // www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
        checkoutPayPal(parms) {
            debugger;
            // global data
            var data = {
                cmd: "_cart",
                business: parms.merchantID,
                upload: "1",
               // rm: "2",
               // charset: "utf-8"
            };
            
            console.log(data);
           console.log('Params ');
           console.log(parms);
        //<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
        //<input type="hidden" name="cmd" value="_s-xclick">
        //<input type="hidden" name="hosted_button_id" value="ZGYAYTSM4SJ9L">
        //<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
        //<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
        //</form>
         
        if(window.location.host === 'localhost:3000'){ 
           data["return"] = 'http://' + window.location.host + '/paypalpaymentsuccess';
           data["cancel_return"] = 'http://' + window.location.host+ '/store';
        }else if(window.location.hostname.substring(0, 3) === 'ec2') {
           data["return"] = 'https://ec2-35-164-131-142.us-west-2.compute.amazonaws.com/paypalpaymentsuccess';
           data["cancel_return"] = 'https://ec2-35-164-131-142.us-west-2.compute.amazonaws.com/store';
        }else{

            data["return"] = 'https://xonumia.io/paypalpaymentsuccess';
            data["cancel_return"] = 'https://xonumia.io/store';
       
        }
         
	      data["cs"] = "#ff0000";
	      data["cancel_return"] = 'https://ec2-35-164-131-142.us-west-2.compute.amazonaws.com/store';

           var ctr = 0;
            // item data
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                console.log(item);
                ctr = i + 1;
                data["item_number_" + ctr] = item.sku;
                data["item_name_" + ctr] = item.name;  
                data["quantity_" + ctr] = item.quantity;
                
                if(this.discount < 1.0){
                data["amount_" + ctr] = (item.price*this.discount).toFixed(2);
                 }else{
                 data["amount_" + ctr] = item.price.toFixed(2); 
                  }
                
                if(this.discountCode !== 'FREESHIP'){
                    if(item.sku === 'PCW-00-9999' || item.sku === 'PCW-00-3001' || item.sku === 'PCW-00-3002'){
                    data["shipping_" + ctr] = 7.00;
                    }else{
                    data["shipping_" + ctr] = 8.00;
                    }
                data["shipping2_" + ctr] = 1.00;
                }
                data["handiling_" + ctr] = 0.0;
                if(this.iswholesale){
                 data["tax_"+ctr] = 0.00;
                }else{
                    if(this.discount < 1.0){
                    data["tax_"+ctr] = (0.04*item.price*this.discount).toFixed(2);
                    }else{
                      data["tax_"+ctr] = (0.04*item.price).toFixed(2);
                    }
                }
                var j=0;
                for (var k in item.options){
                console.log(item.options);
                data["on"+j+"_"+ ctr] = item.options[k][0];
                j++;
                }
            }

           if(this.adv.advId > 0){
                ctr += 1;
                var advId = this.adv.advId;
                console.log(advId );
              
                data["item_number_" + ctr] = advId;
                data["item_name_" + ctr] = 'adv';  
                data["quantity_" + ctr] = 1;
                
                if(this.discount < 1.0){
                data["amount_" + ctr] = (this.adv.calculateCost()*this.discount).toFixed(2);
                 }else{
                 data["amount_" + ctr] = this.adv.calculateCost().toFixed(2); 
                  }
                
          
                 data["shipping_" + ctr] = 0.00;
		   data["shipping2_" + ctr] = 0.00;

                 data["handiling_" + ctr] = 0.00;

            }

         
            console.log(data);
            // build form
            var form = $('<form/></form>');
            form.attr("action", "https://www.sandbox.paypal.com/cgi-bin/webscr");
            form.attr("method", "POST");
            form.attr("style", "display:none;");
            this.addFormFields(form, data);
            //this.addFormFields(form, parms.options);
            $("body").append(form);

            // submit form
           // this.clearCart = clearCart == null || clearCart;
            console.log($(form));
            form.submit();
            form.remove();
        }

       addFormFields (form, data) {
            if (data !== null) {
                $.each(data, function (name, value) {
                    if (value !== null) {
                        var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                        form.append(input);
                    }
                });
            }
        }
        toNumber(value) {
            value = value * 1;
            return isNaN(value) ? 0 : value;
        }
        describe() {
            console.log('THIS IS A SHOPPING CART');
        }
	 setCoinBaseVerificationCode(verification_code){
		console.log('SeT Cart verification_code Code');
		console.log(verification_code);
		
		this.coinbaseVerificationCode = verification_code;
        }
	 coinbasegitbuttonObject(){

	     var cartDescript = "";
	    
             var items = [];
		for (var i=0; i<this.items.length; i++){
			items.push({
				 "name": this.items[i].name,
               		 "sku": this.items[i].sku,
               		 "price": this.items[i].price.toFixed(2),
               		 "currency": "USD",
                		 "quantity": this.items[i].quantity
			});
			cartDescript += this.items[i].name + "-  $"+ this.items[i].price.toFixed(2)+ " - qty: " + this.items[i].quantity + '\n';


		}
		 if(this.adv.advId > 0){
			items.push({
				 "name": "adv_"+ this.adv.advId,
               		 "sku": "XO_ADV_"+ this.adv.advId,
               		 "price": this.adv.calculateCost().toFixed(2),
               		 "currency": "USD",
                		 "quantity": 1
			});

			cartDescript += "XO_ADV_"+ this.adv.advId + "-  $"+ this.adv.calculateCost().toFixed(2) +  '\n';

		}

		var coinButtonObj = {};
		coinButtonObj.json = {
			"amount": this.getTotalTotal().toFixed(2),
			"currency": "USD",
			"type": "order",
			"name": "Xonumia Order: " + this.getCartId(),
		  	"description": cartDescript,
			"success_url": "https://xonumia.io",
  			"cancel_url": "https://xonumia.io",
  			"info_url": "https://xonumia.io",
 			"auto_redirect": false,
			"collect_shipping_address": (this.items.length > 0),
			"metadata": {
			     "verificationCode": this.coinbaseVerificationCode,
           		     "items": JSON.stringify(items),
            		     "currency": "USD",
            		     "total": this.getTotalTotal().toFixed(2),
			     "subtotal":  this.getTotalPrice().toFixed(2),
                	     "tax": this.getTax().toFixed(2),
                	     "shipping": this.getShipping().toFixed(2),
                	     "handling_fee": this.getHandling().toFixed(2)
 
			  }
                  };

	       return coinButtonObj;
	 }
	 getPaypalTransactionObject(){
		
		var items = [];
		for (var i=0; i<this.items.length; i++){
			items.push({
				 "name": this.items[i].name,
               		 "sku": this.items[i].sku,
               		 "price": this.items[i].price.toFixed(2),
               		 "currency": "USD",
                		 "quantity": this.items[i].quantity
			});

		}
		 if(this.adv.advId > 0){
			items.push({
				 "name": "adv_"+ this.adv.advId,
               		 "sku": "XO_ADV_"+ this.adv.advId,
               		 "price": this.adv.calculateCost().toFixed(2),
               		 "currency": "USD",
                		 "quantity": 1
			});

		}
    			
		console.log('getPaypaltransObject This ');
		console.log(this);
		var paypalTransObject = {
    			"intent": "sale",
                     "payer": {
       		 "payment_method": "paypal"
   			 },
                      "redirect_urls": {
       			 "return_url": "https://xonumia.io",
        			"cancel_url": "https://xonumia.io"
    			},
   			"transactions": [{
       		 "item_list": {
           			 "items": items 
				},
       		 "amount": {
            		 "currency": "USD",
            		 "total": this.getTotalTotal().toFixed(2),
           		 "details": {
              		  "subtotal":  this.getTotalPrice().toFixed(2),
                		  "tax": this.getTax().toFixed(2),
                		  "shipping": this.getShipping().toFixed(2),
                		  "handling_fee": this.getHandling().toFixed(2)
           		}
                      
       	     },
        		"description": "Payment to Xonumia."
   		  }]
		};
			console.log(paypalTransObject);
		return paypalTransObject;
        }
	printTransaction(){
		var receipt = {};
		 receipt.total =  this.getTotalTotal().toFixed(2);
           	 receipt.details = {
              		  "subtotal":  this.getTotalPrice().toFixed(2),
                		  "tax": this.getTax().toFixed(2),
                		  "shipping": this.getShipping().toFixed(2),
                		  "handling_fee": this.getHandling().toFixed(2)
           		};

		var items = [];
		for (var i=0; i<this.items.length; i++){
			items.push({
				 "name": this.items[i].name,
               		 "sku": this.items[i].sku,
               		 "price": this.items[i].price.toFixed(2),
               		 "currency": "USD",
                		 "quantity": this.items[i].quantity
			});

		}
               receipt.hasAdv = false;
		 
		 if(this.adv.advId > 0){
		       receipt.hasAdv = true;
			items.push({
				 "name": "adv_"+ this.adv.advId,
               		 "sku": "XO_ADV_"+ this.adv.advId,
               		 "price": this.adv.calculateCost().toFixed(2),
               		 "currency": "USD",
                		 "quantity": 1
			});

		}

		 if(receipt.hasAdv){
			receipt.adv = {};
			receipt.adv.userId = User.id;
			receipt.adv.advId = this.adv.advId;
			receipt.adv.amount = this.adv.calculateCost().toFixed(2);
			receipt.adv.method = 0;
			receipt.adv.status = 0;
			receipt.adv.transId = '';
			
			if(this.coinbaseVerificationCode !== ''){
				receipt.adv.verificationCode =  this.coinbaseVerificationCode;
			}else{
				receipt.adv.verificationCode = '';
			}
		  }
			


              receipt.items = items;
		
		return receipt;
	}
		
}




service = new ShoppingCart();
service.addCheckoutParameters("PayPal", "travis.g-facilitator@paradigmmotion.com");




return service;

}]);

};