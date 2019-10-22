require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('sponsorshipStorePanel', ['$window', '$state', '$http', 'Global', 'User', 'Sponsorship', 'Cart', '$timeout',
            function($window, $state, $http, Global, User, Sponsorship, Cart, $timeout){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/sponsorshipstore';
   directiveObj.controllerAs = 'sponsorshipstoreCtrl';

   directiveObj.link = function($scope, $elem, $attr){
   	    
   	    Sponsorship.getStore().then(function(resp){

              $scope.store = resp;
		 self.intializeAdvCans();
	      
          },function(err){

          });

	
   		console.log('$state in the sponsorshipStorePanel', $state);


       $scope.calcOneMonthRent = function(w,h){
		return 1.5*w*h;
	};
       
 	$scope.drawSponsorshipSpot = function(advId){
		console.log("DRAW SPONSORSHIP SPOT");
		console.log("adV_id_"+advId);
		 var canvas = document.getElementById("adV_id_"+advId);
               var ctx = canvas.getContext("2d");
               ctx.fillStyle = "#FF0000";
               ctx.fillRect(0, 0, 80, 80);
	};

	$scope.advBuy = function(iter){
		Global.advBuy = $scope.store[iter];
              Cart.addAdv($scope.store[iter].id, $scope.store[iter].locX, $scope.store[iter].locY, $scope.store[iter].width, $scope.store[iter].height);

		$state.go('advconfig');
       };
        
       self.intializeAdvCans = function(){
	$timeout(function(){for(var i=0; i<$scope.store.length; i++){
           	 $scope.drawSponsorshipSpot($scope.store[i].id);
		}}, 100);
	 }

   };

  

return directiveObj;
}]);


};