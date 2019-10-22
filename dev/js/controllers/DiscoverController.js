require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('DiscoverController', ['$window', '$state', 'Global', 'User', function($window, $state, Global, User){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


self.logout = function() {
 
    User.logout(User.token);
    $state.go('login');

};



self.initScreen = function(){

};


angular.element($window).bind('resize', function(){
  //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('discover')){
  Global.updateScreenDims();
    self.initScreen();
  }
});

self.initScreen();




   
}]);


}; 