
require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('ContactController', ['User', '$http', function(User, $http){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;

self.user = User;


	self.errors = {contact_name: '',
	              contact_email: '',
				  contact_comment: '',
				  contact_captcha: ''
	               };
	
	
self.formsubmit = function() {




      $('#loader').show();


    var captcha =   $('#g-recaptcha-response');
    console.log(captcha.val());
       
       
       var commentObj = {name: self.contact_name,
                 email: self.contact_email,
                 comment: self.contact_comment,
                 'g-recaptcha-response': captcha.val()
                };	



     $('#contact_comment').focus(function(){
	
	$('#contact_comment').val('');
});	
	         
console.log(commentObj);


 var commentXhrCallConfig = {
                method : 'POST',
                url: 'api/v1/comments',
                //params: null,
                data: $.param(commentObj),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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

           $http(commentXhrCallConfig).then(function(resp){
            

                  if(resp.data.responseDesc === "Please select captcha"){
                    self.errors.contact_captcha = "Please select captcha";
                  }else{



                   $('#contactUsthanks').modal('toggle');
                        console.log('Contact Us Resp');
                        console.log(resp);

                      $('#loader').hide();
                        self.contact_name = '';
                        self.contact_email = '';
                        self.contact_comment = '';
                      
                       self.errors = {contact_name: '',
                                    contact_email: '',
                              contact_comment: '',
                               contact_captcha: ''

                                     };
                                      grecaptcha.reset(); 
                  }


	               

      }, function(err){
      
      console.log('Contact Us Err');
      console.log(err);

      self.errors = err.data;
      $('#loader').hide();

      });


};
  

	  

	  
	  
	  
  }]);


};