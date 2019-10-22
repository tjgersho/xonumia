require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('MainController', ['$scope', '$rootScope', 'User', 'Auth', '$state', 'Cart', function($scope, $rootScope, User, Auth, $state, Cart){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


 $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
       console.log('StateChangeStart');
       console.log(event);
      console.log(toState);
      console.log(toParams);
      console.log(fromState);
       console.log(fromParams);
       console.log(options);
 	self.movileNavOpen = false;
 });


User.isTokenValid();

self.user = User;

self.mobileNavOpen = false;
self.navClick = function(){

 var x = document.getElementById("myTopnav");
    if(self.movileNavOpen){
        self.movileNavOpen = false;
    } else {
        self.movileNavOpen = true;
    }

};


self.mobileNaveClass = function(){
    if(self.movileNavOpen){
        return {'responsive': true};
    }else{
        return {'responsive': false};
    }
};

self.logout = function(){

    User.logout(User.token);

    $state.go('login');

};


self.isAdmin = false;

$scope.$on('UserLoggedIn', function(){
    self.checkAdmin();
    self.isLoggedIn = true;
});

$scope.$on('UserLoggedOut', function(){
   
    self.isLoggedIn = false;
    self.isAdmin = false;
});

self.checkAdmin = function(){
    Auth.adminAuthenticate().then(function(resp){
        console.log("AUTH RESSP");
        console.log(resp);
    self.isAdmin = true;
    },function(err){
        console.log('Auth Error');
        console.log('')
    self.isAdmin = false;
    });
};

self.checkAdmin();

self.cart = Cart;



}]);


		

}; 