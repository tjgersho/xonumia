require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('levelsPanelAdmin', ['$window', '$state', '$http', 'Global', 'User', '$q', function($window, $state, $http, Global, User, $q){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/leveladmin';
   directiveObj.controllerAs = 'levelAdminCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	    

	
   		console.log('$state in the levelAdminPanel', $state);

self.list = [];   

   self.currentpage = 0;

   self.numPerPage = 10;

   self.numPages = function(){
	   return $q(function(resolve, reject){
			
		$http.get('/api/v1/mapsCount', {headers:{auth:User.token}}).then(function(resp){
		   console.log('Get Maps Count Resp');
		   console.log(resp);
	
		   resolve(Math.ceil(resp.data/self.numPerPage));

		},function(err){
		
		   console.log('admin get advs ERR');
		   console.log(err);
		   reject(err);

		});

	    });

	};
  

     self.getList = function(page){
	    self.currentpage = page;

		 $http.get('/api/v1/maps?limit='+self.numPerPage+'&page='+self.currentpage, {headers:{auth:User.token}}).then(function(resp){
		  console.log('Get Xnum Resp');
		   console.log(resp);
	
		   self.list = resp.data;
			
		},function(err){
		
		   console.log('admin get advs ERR');
		   console.log(err);
		  
		});

     
	console.log('YEAS');

    };
	

     self.getList(self.currentpage);


   };

  

return directiveObj;
}]);


};