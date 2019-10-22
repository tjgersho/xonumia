require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('merchSalesAdmin', ['$window', '$state', '$http', 'Global', 'User', '$q', function($window, $state, $http, Global, User, $q){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/merchsaleadmin';
   directiveObj.controllerAs = 'merchSaleAdminCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	    
     self.numPerPage = 10;
     self.currentpage = 0;
    self.numPages = function(){
	   return $q(function(resolve, reject){
			
		$http.get('api/v1/merchSaleCount', {headers:{auth:User.token}}).then(function(resp){
		   console.log('Get advCount Resp');
		   console.log(resp);
	
		   resolve(Math.ceil(resp.data/self.numPerPage));

		},function(err){
		
		   console.log('admin get advs ERR');
		   console.log(err);
		   reject(err);

		});

	    });

	};

    self.list = [];

   self.getList = function(page){
   		self.currentpage = page;
		$http.get('api/v1/merchSale?limit='+self.numPerPage+'&page='+self.currentpage, {headers:{auth:User.token}}).then(function(resp){
		console.log('admin get advs');
		console.log(resp);
		self.list = resp.data;

	},function(err){
		
		console.log('admin get advs ERR');
		console.log(err);
	});

     
	
   };

     self.getList(self.currentpage);
 
	

   };

  

return directiveObj;
}]);


};