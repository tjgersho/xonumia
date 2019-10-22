require('angular');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('SignupController', ['$window', '$state', 'Global', 'User', function($window, $state, Global, User){
    //console.log("SignupController");
  //console.log(Global);
//console.log(User);
var self = this;

self.initScreen = function(){

};

  var username = $('#username');
  var email = $('#email');
  var userPassword = $('#password');

  var signupBtn = $('#signupButton');

self.signup = function(){

	var u = username.val();
	var e = email.val();
    var p = userPassword.val();
    
		User.signup(u, e, p).then(function(resp){
		//console.log('Signup Resp');
		//console.log(resp);
		//console.log(u, p);
         
				 User.login(e, p).then(function(resp){
				//console.log('Login Resp');
				//console.log(resp);

				 $state.go('play');	
				},function(err){
				//console.log("Login ERR");
				//console.log(err);
				});

		},function(err){
		//console.log("Signup ERR");
		//console.log(err);
		});
};


       // btnS = document.getElementById('spectateButton'),
       // nickErrorText = document.querySelector('#startMenu .input-error');

    //btnS.onclick = function () {
    //    startGame('spectate');
   // };

    signupBtn.click(function () {
        self.signup();
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

    username.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.signup();
        }
    });
     email.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.signup();
        }
    });
    userPassword.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
           self.signup();
        }
    });



angular.element($window).bind('resize', function(){
    //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('signup')){
	Global.updateScreenDims();
    self.initScreen();
  }
});

self.initScreen();




   

}]);


}; 