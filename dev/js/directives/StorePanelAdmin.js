require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('storePanelAdmin', ['$window', '$state', '$http', 'Global', 'User', 'Merch', function($window, $state, $http, Global, User, Merch){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/storeadmin';
   directiveObj.controllerAs = 'storeCtrl';

   directiveObj.controller = function(){
   	    var self = this;

   	function clearAdvInputs(){

	document.getElementById('file').value = null;

	}

 self.adminstore = [];

        self.getadminstore = function(){
		
          self.adminstore = [];
		Merch.getStore().then(function(resp){
			console.log("GET STORE IN ADMIN STORE");
			console.log(resp);
			self.adminstore = resp;
		},function(err){


		});

		};




			console.log('ADMIN Store CONROLLER');
	
   		console.log('$state in the StorePanelContainer', $state);


	self.addsellableitem = function(){
 			 $('#AddSellableItem').modal('toggle');
	};


    self.addnewitem = {sku: '',
                         name: '',
                         baseprice: '',
                         wholesaleprice: ''
                     };

  self.submitaddnewitempost = function(){
   	console.log('Add New Item');
	console.log(self.addnewitem);
	
       $http.post('/api/v1/merch', self.addnewitem,  {
             headers: {
                auth: User.token
             }
         }).then(function(resp){
       	console.log('Add store item Response');
       
       	console.log(resp);
       
       	$('#AddSellableItem').modal('toggle');

      		 self.getadminstore();
       },function(err){
       console.log('Add store item Err');
       
       console.log(err);
       
       });
      
      
     
     };



  self.deletestoreitemmodal = function(itemid){
  	self.delitemid = itemid;
 	 $('#DeleteProduct').modal('toggle');
  
  	};
  self.delitemsku = '';
      
   self.deleteitem = function(itemid){
   
       $http.delete('/api/v1/merch/'+itemid,{
             headers: {
                auth: User.token
             }
         }).then(function(resp){
       console.log('Delete item Response');
       
       console.log(resp);
  $('#DeleteProduct').modal('toggle');
       self.getadminstore();
       },function(err){
       console.log('Delete item Err');
         $('#DeleteProduct').modal('toggle');
       console.log(err);
       
       });
      
      
     };
 
     self.storeitembg = function(ind){
       if(ind%2 == 0){
     return {'background-color':'#e6e6e6', 'margin-bottom': '20px'};
     }else{
     return {'background-color':'#FFF', 'margin-bottom': '20px'};
     }
   };

self.getadminstore();
};

  

return directiveObj;
}]);


};