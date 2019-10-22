
require('angular');
require('angular-ui-router');
var $ = require('jquery');
require('ngstorage');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('User', ['$rootScope', '$http', '$q', '$localStorage', function($rootScope, $http, $q, $localStorage){
    ////console.log("User Service");


var service = {
    // Keys and other mathematical constants
     id: '',
     username: '',
     email: '',
     numberOfXnum: function(){
  		var defered =  $q.defer();
				$http.get('/api/v1/userNumXnum/', {headers:{auth:service.token}}).then(function(resp){
					console.log('UserService Get numberOf Xnum');
					console.log(resp);
					service.xnumCount = resp.data;
					defered.resolve(resp.data);
					

				},function(err){
					console.log('UserService Get numberOf Xnum ERR');
					console.log(err);
					defered.reject(err);
					
				});
		
            return defered.promise;
     },
     valueOfXnum: function(){
  		var defered =  $q.defer();
				$http.get('/api/v1/userValXnum/', {headers:{auth:service.token}}).then(function(resp){
					console.log('UserService Get  xnumValue Xnum');
					console.log(resp);
					service. xnumValue = resp.data;
					defered.resolve(resp.data);
					

				},function(err){
					console.log('UserService Get  xnumValue Xnum ERR');
					console.log(err);
					defered.reject(err);
					
				});
		
            return defered.promise;
     },
     availableValueOfXnum: function(){
  		var defered =  $q.defer();
				$http.get('/api/v1/userAvailValXnum/', {headers:{auth:service.token}}).then(function(resp){
					console.log('UserService Get  AvailxnumValue Xnum');
					console.log(resp);
					service.xnumAvailableValue = resp.data;
					defered.resolve(resp.data);
					

				},function(err){
					console.log('UserService Get AvailxnumValue Xnum ERR');
					console.log(err);
					defered.reject(err);
					
				});
		
            return defered.promise;
     },
     xnumCount: 0,
     xnumValue: 0,
     xnumAvailableValue: 0,
     token: '',
     loggedin: false,
     isTokenValid: function(){
        var defered =  $q.defer();
          ////console.log('Is Token Valid Service');
          ////console.log('token');
          ////console.log(service.token);
         
         if(typeof($localStorage.token) !== 'undefined' && $localStorage !== null){
            service.token = $localStorage.token;
         }
         console.log("IN SERVICE TOKEN");
         console.log(service.token);
		if(service.token !== null && service.token !== undefined && service.token !== ''){
			//loadgif.attr('src', 'img/loading.gif');
			  $http.post('/api/v1/users/findByToken', {"token": service.token}).then(function(resp){
			console.log('FindByToken Server Response');
			console.log(resp);
                      service.loggedin = true;
                      service.username = resp.data.username;
                      service.email = resp.data.email;
                      service.id = resp.data.id;
                      service.loggedin = true;
                      service.token = service.token;
			 service.xBits = resp.data.xBits;

                      service.bodyColorR = resp.data.bodyColorR;
		        service.bodyColorG = resp.data.bodyColorG;
                      service.bodyColorB = resp.data.bodyColorB;
		        service.bodyColorA = resp.data.bodyColorA;

			 service.borderColorR = resp.data.borderColorR;
		        service.borderColorG = resp.data.borderColorG;
                      service.borderColorB = resp.data.borderColorB;
		        service.borderColorA = resp.data.borderColorA;


		       defered.resolve(resp.data);

			},function(err){
                service.token = '';
                $localStorage.token = null;
                service.loggedin = false;
		       defered.reject('Token Not Valid');
			});
			
		}else{
			defered.reject('Token Not Valid');
		}
        return defered.promise;
	},
    login: function(username_or_email, password){
            var defered =  $q.defer();

                if($localStorage.token !== 'undefined' && $localStorage.token !== null){
                   var logoutToken = $localStorage.token;
                    service.logout(logoutToken);
                }
      

         
             var loginData = {
             email_or_username: username_or_email,
             password: password
             };

            var loginXhrCallConfig = {
                method : 'POST',
                url: 'api/v1/users/login',
                data: loginData,
                responseType: "json"
            };

           $http(loginXhrCallConfig).then(function(resp){
                     service.token = resp.headers('auth');
                     $localStorage.token = service.token;
                      service.username = resp.data.username;
                     service.email = resp.data.email;
                     service.id = resp.data.id;
                      service.loggedin = true;

                      $rootScope.$broadcast('UserLoggedIn', {});

                      defered.resolve('Login Successfull');
           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;
        },

        signup: function(username, email, password){
            var defered =  $q.defer();

                if($localStorage.token !== 'undefined' && $localStorage.token !== null){
                  ////console.log("Signup Trying to delete local token");
                  ////console.log($localStorage.token);
                   var logoutToken = $localStorage.token;
                    service.logout(logoutToken);
                }
      

         
             var signupData = {
             username: username,
             email: email,
             password: password
             };

            var signupXhrCallConfig = {
                method : 'POST',
                url: '/api/v1/users',
                data: signupData,
                responseType: "json"
            };

           $http(signupXhrCallConfig).then(function(resp){
                     ////console.log("SIGN UP RESP");

                      ////console.log(resp);
                     service.username = resp.data.username;
                     service.email = resp.data.email;
                     service.id = resp.data.id;


                      defered.resolve('Signup Successfull');
           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;
        },
        // Checks if the nick chosen contains valid alphanumeric characters (and underscores).
      validNick: function() {
         var regex = /^\w*$/;
         debug('Regex Test', regex.exec(service.username));
         return regex.exec(service.username) !== null;
      },
      logout: function(token){
          
          var defered =  $q.defer();

            var logoutXhrCallConfig = {
                method : 'DELETE',
                url: 'api/v1/users/login',
                headers: {auth: token},
                responseType: "json"
            };

           $http(logoutXhrCallConfig).then(function(resp){
                  $localStorage.token = null;
                  service.username = '';
                  service.email = '';
                  service.id = '';
                  service.loggedin = false;
                   $rootScope.$broadcast('UserLoggedOut', {});
                      defered.resolve('Logout Successfull');

           }, function(err){
                $localStorage.token = null;
                  service.username = '';
                  service.email = '';
                  service.id = '';
                  service.loggedin = false;
                    defered.reject(err);
           });
         
          return defered.promise;


       
       },
	updateColor: function(colorData) {
       
		var defered =  $q.defer();

              var updateColorXhrCallConfig = {
                method : 'PUT',
                url: '/api/v1/users',
                data: colorData,
                headers: {auth: service.token},
                responseType: "json"
            };

           $http(updateColorXhrCallConfig).then(function(resp){
                     ////console.log("SIGN UP RESP");

                     defered.resolve('Color Update Successfull');

           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;



      },
	recoverPW: function(username_or_email) {
               console.log('USER PW RECOVERY SERVICE');
		var defered =  $q.defer();

              var recoverPWXhrCallConfig = {
                method : 'POST',
                url: '/api/v1/recoverPW',
                data: {'username_or_email': username_or_email},
                responseType: "json"
            };

           $http(recoverPWXhrCallConfig).then(function(resp){
                     console.log("Recover PW RESP in Service");
 			console.log(resp);
                     defered.resolve(resp);

           }, function(err){
                    defered.reject(err);
           });
         
          return defered.promise;
      },
       changePW: function(username, password1, password2) {
               console.log('USER PW Change SERVICE');
		var defered =  $q.defer();
		var data = {
			username: username,
			password1: password1,
			password2: password2
              };
              var changePWXhrCallConfig = {
                method : 'POST',
                url: '/api/v1/changePW',
                data: data,
                headers: {auth: service.token},
                responseType: "json"
            };

           $http(changePWXhrCallConfig).then(function(resp){
                     console.log("Change PW Response in Service");
 			console.log(resp);
                     defered.resolve(resp);

           }, function(err){
			console.log('Error ChangePW');
			console.log(err);
                    defered.reject(err);
           });
         
          return defered.promise;
      }



  };


return service;
}]);

};