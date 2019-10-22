require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('playerPanelAdmin', ['$window', '$state', '$http', 'Global', 'User', function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/playeradmin';
   directiveObj.controllerAs = 'playerAdminCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	    

	
   		console.log('$state in the payoutAdminPanel', $state);
   };

  

return directiveObj;
}]);


};