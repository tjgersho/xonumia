require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('advRud', ['$window', '$state', '$http', 'Global', 'User',  function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/advrud';
    directiveObj.scope = {
          adv: '=adv',
	   index: '@',
	   getlistpromise: '&'
           };

   directiveObj.link = function($scope, $element, $attrs){
   	            		
	console.log('Scope in AdvRud');
	console.log($scope.adv);
	
	$scope.updateaspect = function(adv, aspect){
		console.log('AdvId: '+ adv.id, '-  Aspect ' +  aspect);
		adv.aspect = aspect;
              $http.put('api/v1/adv/' + adv.id, {aspect: aspect}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update aspect in Adv');
			console.log(resp);
		},function(err){
			console.log('Update aspect in Adv ERR');
			console.log(err);
		});


	};

	$scope.updateHasLink = function(id, hasLink){

		console.log('AdvId: '+ id, '-  Has Link ' +  hasLink);
		$http.put('api/v1/adv/' + id, {hasLink: hasLink}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update haslink in Adv');
			console.log(resp);
		},function(err){
			console.log('Update haslink in Adv ERR');
			console.log(err);
		});


	};

	$scope.updateAvailability = function(id, avail){

		console.log('AdvId: '+ id, '-  avail ' +  avail);
		$http.put('api/v1/adv/' + id, {available: avail}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update available in Adv');
			console.log(resp);
		},function(err){
			console.log('Update availablein Adv ERR');
			console.log(err);
		});


	};


	$scope.updateInterest = function(id, interest){
		
		console.log('AdvId: '+ id, '-  interest ' + interest);
		$http.put('api/v1/adv/' + id, {sponsorshipInterest: interest}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update interest in Adv');
			console.log(resp);
		},function(err){
			console.log('Update interest in Adv ERR');
			console.log(err);
		});

	};


	$scope.updateLink = function(id, link){

		console.log('AdvId: '+ id, '-  Link' +  link);

		$http.put('api/v1/adv/' + id, {link: link}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update link in Adv');
			console.log(resp);
		},function(err){
			console.log('Update link in Adv ERR');
			console.log(err);
		});


	};

       


	
	$scope.updateUserId = function(id, userId){

		console.log('AdvId: '+ id, '-  UserId' + userId);
		$http.put('api/v1/adv/' + id, {userId: userId}, {headers:{auth:User.token}}).then(function(resp){
			console.log('Update User Id in Adv');
			console.log(resp);
		},function(err){
			console.log('Update User Id in Adv ERR');
			console.log(err);
		});

	};
     

	$scope.deleteAdv = function(id){

		$http.delete('api/v1/adv/'+id, {headers:{auth:User.token}}).then(function(resp){
			console.log('Delete');	
			console.log(resp);
			$scope.getlistpromise({page: 0});
			
		},function(err){
			console.log('Error Deleting Adv');
			console.log(err);
		});
        };


   };

  

return directiveObj;
}]);


};