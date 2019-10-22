require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('RecoverPWController', ['$window', '$state', 'Global', 'User', function($window, $state, Global, User){

var self = this;


self.inputError = '';


self.initScreen = function(){

};

self.loader = false;

  var username_or_email = $('#username_or_email');
 

  var recoverPWBtn = $('#recoverPWButton');

self.recoverPW = function(){
    
    self.loader = true;
    var u_o_e = username_or_email.val();
    console.log(u_o_e);

     User.recoverPW(u_o_e).then(function(resp){
		console.log('GetPW Resp');
		console.log(resp);
              self.loader = false;
		self.inputError = '';
		 $state.go('login');	
               

		},function(err){
		console.log("Login ERR");
		console.log(err);
     		self.inputError = "An Error Occured While Trying to Get your Password Reset Email";

      		self.loader = false;

		});
};


    recoverPWBtn.click(function () {
	        self.recoverPW();
    });

  
    username_or_email.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.recoverPWBtn();
        }
    });
   


angular.element($window).bind('resize', function(){
  //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('login')){
	Global.updateScreenDims();
    self.initScreen();
  }
});

self.initScreen();




   
}]);


}; 