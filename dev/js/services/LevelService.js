//LEVEL SERVICE


require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Levels', ['$http', '$q', 'User',  function($http, $q, User){


    //console.log("Global Service");
var service = {};

service.getLevels = function(url){
var defered =  $q.defer();

 var levelsGetXhrCallConfig = {
                method : 'GET',
                url: url,
                //params: null,
                //data: tile,
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

           $http(levelsGetXhrCallConfig).then(function(resp){
            defered.resolve(resp.data);
           }, function(err){
            defered.reject(err);
           });

 
 return defered.promise;
};


service.getMapTiles = function(url){

var defered =  $q.defer();

 var mapGetXhrCallConfig = {
                method : 'GET',
                url: url,
                //params: null,
                //data: tile,
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

           $http(mapGetXhrCallConfig).then(function(resp){
            defered.resolve(resp.data);
           }, function(err){
               defered.reject(err);
           });
 return defered.promise;
};

service.getAdvs = function(url){

var defered =  $q.defer();

 var advsGetXhrCallConfig = {
                method : 'GET',
                url: url,
                //params: null,
                //data: tile,
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

           $http(advsGetXhrCallConfig).then(function(resp){
	
		for(var i=0; i<resp.data.length; i++){
		var advimag = resp.data[i].img;
               var ext = advimag.substr(advimag.lastIndexOf('.'));
 		 console.log(advimag);
		 console.log(ext);
		 var basename = advimag.substr(0,advimag.lastIndexOf('.'));
               console.log(basename);
              resp.data[i].imgL = basename + '_L' + ext;
          	resp.data[i].imgM = basename + '_M' + ext;
              resp.data[i].imgS = basename + '_S' + ext;

       	 }
            defered.resolve(resp.data);
           }, function(err){
               defered.reject(err);
           });
 return defered.promise;

};

return service;
}]);

};
