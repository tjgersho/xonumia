require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('commentsPanelAdmin', ['$window', '$state', '$http', 'Global', 'User', '$q', function($window, $state, $http, Global, User, $q){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/commentsadmin';
   directiveObj.controllerAs = 'commentsAdminCtrl';

   directiveObj.controller = function(){
   	    var self = this;
   	 
       console.log('USER');
	     console.log(User);
   		 console.log('$state in the commentsAdminPanel', $state);


  

    self.numPerPage = 10;
     self.currentpage = 0;
    self.numPages = function(){
	   return $q(function(resolve, reject){
			
		$http.get('/api/v1/commentsCount', {headers:{auth:User.token}}).then(function(resp){
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
		$('#contactusmsglistloading').show();
   		self.currentpage = page;
		$http.get('api/v1/comments?limit='+self.numPerPage+'&page='+self.currentpage, {headers:{auth:User.token}}).then(function(resp){
		console.log('admin get advs');
		console.log(resp);
		self.list = resp.data;
             $('#contactusmsglistloading').hide();

	},function(err){
		
		console.log('admin get advs ERR');
		console.log(err);
		$('#contactusmsglistloading').hide();
	});

     
	
   };

     self.getList(self.currentpage);


       
    self.deletecomment = function(msgID){

     var deleteContactUsXhrCallConfig = {
                method : 'DELETE',
                url: 'api/v1/comments/'+msgID,
                //params: null,
                //data: loginData,
                headers: {auth: User.token},
                //eventHandlers: {},
                //uploadEventHandlers: {},
                //xsrfHeaderName: '',
                //xsrfCookieName: '',
                //transformRequest: function(data, headersGetter) {},
                //tranformResponse: function(data, headersGetter, status){},
                //paramSerializer: '',
                //cache: false,
                //timeout: null,
                //withCredentials: false,
                responseType: "json"
            };

           $http(deleteContactUsXhrCallConfig).then(function(resp){
                    self.getcontactusMsgs();
             $('#contactusmsglistloading').hide();
             }, function(err){
                       //console.log('Get PayList ERR Response');   
              // console.log(err);
               self.cterr = err.data;
                 $('#contactusmsglistloading').hide();
            });

   };
   



 ///////////////////////////////////////////////////////////////////////////////////////////////
         
   };

  

return directiveObj;
}]);


};