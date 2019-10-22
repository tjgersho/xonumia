//Global Variables Service

require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Sponsorship', ['$http', '$q', 'User', function($http, $q, User) {



  var service = {};


service.getStore = function(){
 var defered =  $q.defer();


            var getSponsorshipsXhrCallConfig = {
                method : 'GET',
                url: '/api/v1/adv',
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

           $http(getSponsorshipsXhrCallConfig).then(function(resp){
                    
                      defered.resolve(resp.data);

           }, function(err){

                    defered.reject(err);

           });
         
  return defered.promise;

};



return service;

}]);

};