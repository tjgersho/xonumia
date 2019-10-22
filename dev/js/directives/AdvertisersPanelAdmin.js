require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('advertisersPanelAdmin', ['$window', '$state', '$http', 'Global', 'User', function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/advertisersadmin';
   directiveObj.controllerAs = 'advertisersCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	    

	
   		console.log('$state in the advertisersAdmin', $state);


	self.advs = [];
	$http.get('api/v1/adv', {headers:{auth:User.token}}).then(function(resp){
		console.log('admin get advs');
		console.log(resp);
		self.advs = resp.data;

	},function(err){
		
		console.log('admin get advs ERR');
		console.log(err);

	});
   };

  

return directiveObj;
}]);


};