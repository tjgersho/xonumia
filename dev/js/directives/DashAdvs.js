require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('dashAdvs', ['$window', '$state', '$http', 'Global', 'User',  function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/dashadvertisements';
    directiveObj.scope = {
          advData: '='
           };

   directiveObj.link = function($scope, $element, $attrs){
   	            		
	console.log('Scope in DashAdvs');
	console.log($scope.advData);
	
	$scope.loading = true;

	$scope.$watch('advData', function(newValue, oldValue ){

		console.log('Onchange watch');
		console.log('Num Concurs');
		console.log(newValue, oldValue);
		if(newValue.count > 0){
			if($scope.loading){
			$scope.loading = false;
			//do something
			}
			
		}
	});

	

	



   };

  

return directiveObj;
}]);


};