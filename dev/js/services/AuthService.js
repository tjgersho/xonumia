//AuthService

require('angular');
require('angular-ui-router');
var $ = require('jquery');


module.exports.service = function(){
'use strict';
angular.module('Services').factory('Auth', ['$http', '$q',  '$localStorage', function($http, $q, $localStorage){
    ////console.log("User Service");
var service = {
    // Keys and other mathematical constants
        adminAuthenticate: function(){
            var defered =  $q.defer();
             console.log("$localStorage.token");
             console.log($localStorage.token);

            var adminAuthXhrCallConfig = {
                method : 'GET',
                url: '/api/v1/auth',
                //params: null,
                //data: signupData,
                headers: {auth: $localStorage.token},
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

           $http(adminAuthXhrCallConfig).then(function(resp){
                    console.log("AdminAuth Resp");

                     console.log(resp);
 
                      defered.resolve('Is Admin Successfull');
           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;
        },
        userAuthenticate: function(){
            var defered =  $q.defer();
             console.log("$localStorage.token");
             console.log($localStorage.token);

            var userAuthXhrCallConfig = {
                method : 'GET',
                url: '/api/v1/auth',
                //params: null,
                //data: signupData,
                headers: {auth: $localStorage.token},
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

           $http(userAuthXhrCallConfig).then(function(resp){
                    console.log("AdminAuth Resp");

                     console.log(resp);
 
                      defered.resolve('Is Admin Successfull');
           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;
        }
     
  };


return service;
}]);

};