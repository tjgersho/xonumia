require('angular');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('ChangePWController', ['$window', '$state', 'Global', 'User', function($window, $state, Global, User){
    //console.log("SignupController");
  //console.log(Global);
//console.log(User);
var self = this;

self.initScreen = function(){

};


console.log('ChangePasswordCtrl STATE');
console.log($state);
if($state.params.username === undefined){
 $state.go('resetpw');
}

if($state.params.code === undefined){
  $state.go('resetpw');
}



self.username = $state.params.username;
var temp_pswd = $state.params.code;

self.logUserIn = function(){
      if(!User.loggedin){
	User.login(self.username, temp_pswd).then(function(resp){
		//console.log('Login Resp');
		//console.log(resp);
               self.loader = false;
		 
               self.loginError = '';

		},function(err){
		  console.log("Login ERR");
		  console.log(err);
                              
                self.loader = false;
                $state.go('resetpw');
		});
         }
};

  self.logUserIn();

  var new_password1 = $('#password1');
  var new_password2 = $('#password2');

  var changePWBtn = $('#changePWButton');

self.validatePW = function(){
   var psswdmatchBool = false;
  if(new_password1.val() !== new_password2.val()){
 	psswdmatchBool = false;
  }else{
     psswdmatchBool = true;
   }

   return psswdmatchBool && User.loggedin;

};

self.validatePWerrorMsg = function(){

  if(new_password1.val() !== new_password2.val()){
 	return "Password Entries do not Match";
  }

};

self.changePW = function(){
      
	var p1 = new_password1.val();
       var p2 = new_password2.val();
    
		User.changePW(self.username, p1, p2).then(function(resp){
		 console.log('Change Password Ctrl Resp');
		 console.log(resp);
		
         
		 $state.go('play');	
		
		},function(err){
		    console.log("Change Password ERR");
		    console.log(err);
		});
};


    changePWBtn.click(function () {
        self.changePW();
    });

    
      new_password2.on('keypress', function (e) {
        var key = e.which || e.keyCode;
        // //console.log(key);
        if (key === Global.KEY_ENTER) {
            self.changePW();
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