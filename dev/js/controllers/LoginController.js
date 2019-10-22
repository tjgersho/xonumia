require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('LoginController', ['$window', '$state', 'Global', 'User', function($window, $state, Global, User){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


self.loginError = '';


self.initScreen = function(){

};

self.loader = false;

  var username_or_email = $('#username_or_email');
  var userPassword = $('#password');

  var loginBtn = $('#loginButton');

self.login = function(){
 self.loader = true;
	var u_o_e = username_or_email.val();
    var p = userPassword.val();
    
		User.login(u_o_e, p).then(function(resp){
		//console.log('Login Resp');
		//console.log(resp);
      self.loader = false;
		 $state.go('play');	
     self.loginError = '';

		},function(err){
		console.log("Login ERR");
		console.log(err);
     self.loginError = "An Error Occured While Trying to Login";

      self.loader = false;
		});
};



    loginBtn.click(function () {
      
        self.login();
    });

    //var settingsMenu = document.getElementById('settingsButton');
   
    var instructions = document.getElementById('instructions');

   // settingsMenu.onclick = function () {
     //   if (settings.style.maxHeight == '300px') {
       //     settings.style.maxHeight = '0px';
       // } else {
       //     settings.style.maxHeight = '300px';
       // }
    //};

    username_or_email.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.login();
        }
    });
    userPassword.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.login();
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