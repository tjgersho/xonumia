require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('homePanelAdmin', ['$window', '$state', '$http', 'Global', 'User', function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/homepaneladmin';
   directiveObj.controllerAs = 'homeAdminCtrl';

   directiveObj.controller = function(){
   	    var self = this;


		///Control Tabs
        self.adminSwitchBoard = true;
	 self.adminBuildLevel = false;
	 self.adminKeyValueCRUD = false;
	 self.scratchTests = false;

         self.activatePanel = function(ind){
		switch(ind){
			case 0:
			 self.adminSwitchBoard = true;
			 self.adminBuildLevel = false;
			 self.adminKeyValueCRUD = false;
		        self.scratchTests = false;
			 break;

			case 1:
			 self.adminSwitchBoard = false;
	 		 self.adminBuildLevel = true;
			 self.adminKeyValueCRUD = false;
			 self.scratchTests = false;
			 break;

			 case 2:
			 self.adminSwitchBoard = false;
	 		 self.adminBuildLevel = false;
			 self.adminKeyValueCRUD = true;
			 self.scratchTests = false;
			 break;
		
			 case 3:
			 self.adminSwitchBoard = false;
	 		 self.adminBuildLevel = false;
			 self.adminKeyValueCRUD = false;
			 self.scratchTests = true;
			 break;

			default:
			 self.adminSwitchBoard = true;
			 self.adminBuildLevel = false;
			 self.adminKeyValueCRUD = false;
			 self.scratchTests = false;
              }

	  }
	
   ///READ admin key Value ///

	$http.get('api/v1/admin/keyvals', {headers:{auth:User.token}}).then(function(resp){
		console.log('RESPONSE Get AdminVals');
		console.log(resp);
		self.adminKeyValueObjArray = [];  
		var arrLen = resp.data.length;
		for(var i=0; i<arrLen; i++){
		self.adminKeyValueObjArray[i] = {};
		self.adminKeyValueObjArray[i][resp.data[i].keyname] = JSON.parse(resp.data[i].valuestring);
		}
		
		console.log(self.adminKeyValueObjArray);

       },function(err){

		console.log('RESPONSE Get AdminVals Err');
		console.log(err);  



	});
	
   ////UPDATE admin key Value ///


	
 



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////Scratch Tests --- HIT SERVER END POINTS ///////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////










   ///Scratch Tests --- HIT SERVER END POINTS ////
self.paypalPaymentSuccessEndpointTestAjax = function(){
  $http.post('paypalpaymentsuccess', {}).then(function(resp){
	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS");
	console.log(resp);

  },function(err){

  	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS ERR");
	console.log(err);

  });

};

self.paypalPaymentSuccessEndpointTestFORM = function(){
 var form = document.createElement("form");
  	 form.setAttribute("method", "post");
   	 form.setAttribute("action", "/paypalpaymentsuccess");

   	//for(var key in checkout) {
    	  // if(checkout.hasOwnProperty(key)) {
        //	 var hiddenField = document.createElement("input");
         //	 hiddenField.setAttribute("type", "hidden");
           //	 hiddenField.setAttribute("name", key);
          	// hiddenField.setAttribute("value", checkout[key]);

          // 	 form.appendChild(hiddenField);
         //	 }
   	 //}

   	 document.body.appendChild(form);
   	 form.submit();	 
        form.parentNode.removeChild(form);
};



self.paypalRESTTesting = function(){
 console.log('PAY PAL REST TESTING');

  $http.post('api/v1/paypal/create-payment', {}).then(function(resp){
	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS");
	console.log(resp);

  },function(err){

  	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS ERR");
	console.log(err);

  });

};


self.coinbaseAPIposts = function(uri){
 console.log('coinbaseAPI REST TESTING');
 console.log(uri);

  $http.post(uri, {}, {headers:{auth: User.token}}).then(function(resp){
	console.log("RESPONS FROM coinbaseAPIPosts");
	console.log(resp);

  },function(err){

  	console.log("RESPONS FROM coinbaseAPIPosts ERR");
	console.log(err);

  });

};












////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////
      ///////LEVEL BUILD POST DATA /////////////////
   	    self.levelForBuild = '';
           self.minX = -25;
           self.minY = -25;
           self.maxX = 25;
           self.maxY = 25;
	
             self.buildLargeLevel = function(){
		var sendObj = {};
	
		sendObj.level = self.levelForBuild;
		sendObj.minX = self.minX;
              sendObj.minY = self.minY;
           	sendObj.maxX = self.maxX;
              sendObj.maxY = self.maxY;


	       $http.post('api/v1/admin/buildLevel', sendObj, {headers:{auth: User.token}}).then(function(resp){
	              	console.log('RESPONSE LEVEL BUILD');
				console.log(resp);  
				alert('DONE BUILDING LEVEL');
		},function(err){
				console.log('RESPONSE LEVEL BUILD ERR');
				console.log(err);  
		});

		
	       };
 ////////////////////////////////////////////
 ////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
   };

  

return directiveObj;
}]);


};