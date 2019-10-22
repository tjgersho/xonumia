require('angular');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('PayPalSucessController', ['$window', '$state', 'Global', 'User', '$http', function($window, $state, Global, User, $http){
    //console.log("SignupController");
  //console.log(Global);
//console.log(User);
var self = this;

self.initScreen = function(){

};

self.passedData =  '';
 
$http.get('api/v1/paypalpaymentdetails').then(function(resp){
	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS GET");
	console.log(resp);
       self.passedData = resp;
       self.initScreen();

  },function(err){

  	console.log("RESPONS FROM PAYPAL PAYEMNT SUCCESS GET ERR");
	console.log(err);

  });


angular.element($window).bind('resize', function(){
    //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('signup')){
	Global.updateScreenDims();
       self.initScreen();
   }
});






  
}]);


}; 