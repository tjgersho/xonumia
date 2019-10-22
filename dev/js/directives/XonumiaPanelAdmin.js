require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('xonumiaPanelAdmin', ['$window', '$state', '$http', 'Global', 'User', '$q', '$rootScope', function($window, $state, $http, Global, User, $q, $rootScope){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/xonumiaadmin';
   directiveObj.controllerAs = 'xoadminCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	    
	
	
   	console.log('$state in the XonumiaAdminPanel', $state);

   self.list = [];   

   self.currentpage = 0;

   self.numPerPage = 10;

   self.numPages = function(){
	   return $q(function(resolve, reject){
			
		$http.get('/api/v1/xnumCount', {headers:{auth:User.token}}).then(function(resp){
		   console.log('Get Xnum Resp');
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

		 $http.get('/api/v1/xnum?limit='+self.numPerPage+'&page='+self.currentpage, {headers:{auth:User.token}}).then(function(resp){
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

      self.deleteXnum = function(id){
		console.log('Delete XNUM');
		console.log(id);
	
		$http.delete('/api/v1/xnum/'+ id, {headers:{auth:User.token}}).then(function(resp){
		    console.log('Get Xnum Resp');
		   console.log(resp);
	         self.list =  self.list.filter(function(x){
				return x.id !== id;
		   });
		 		
		},function(err){
		
		   console.log('admin get advs ERR');
		   console.log(err);
		  
		});

      };
   };

  

return directiveObj;
}]);


};