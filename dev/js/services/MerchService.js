//Global Variables Service

require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Merch', ['$http', '$q', 'User', function($http, $q, User) {


  var service = {};


service.getStore = function(){
 var defered =  $q.defer();


            var getStoreXhrCallConfig = {
                method : 'GET',
                url: 'api/v1/merch',
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

           $http(getStoreXhrCallConfig).then(function(resp){
                    
                      defered.resolve(resp.data);

           }, function(err){

                    defered.reject(err);

           });
         
  return defered.promise;

};




service.getProduct = function(id){
 var defered =  $q.defer();


            var getStoreXhrCallConfig = {
                method : 'GET',
                url: 'api/v1/merch/'+id,
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

           $http(getStoreXhrCallConfig).then(function(resp){
                    
                      defered.resolve(resp.data[0]);

           }, function(err){

                    defered.reject(err);

           });
         
  return defered.promise;

};




return service;

}]);

};