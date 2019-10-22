require('angular');
var $ = require('jquery');

require('../../libs/jquery.zoom.js').fn($);
//require('../../libs/lightgallery.js');
require('lightgallery.js');
require('lg-thumbnail.js');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('zoomproductPics', ['$timeout', '$window', '$location', '$state', 'Merch', function($timeout, $window, $location, $state, Merch){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/zoompics';
    directiveObj.scope = {
    			prod: '=product'                 
		 };

   directiveObj.link = function($scope, $element, $attrs){

        $scope.clickThumb = function($event){ 
		$("#img_"+$scope.prod.id).parent().trigger('zoom.destroy');
		 var targetid = $($event.target).attr('id');
		 $scope.currentImg =  Number(targetid.substr(9));
		$scope.initialize();
		
	  };
	console.log("PRODUCT IN ZOOM PICS");
	console.log($scope);
	
	 $scope.initialize = function(){
		console.log($scope.currentImg);
		 console.log("HELLO INIT ZOOM");
		  console.log('public/prodImages/'+$scope.prod.id+'/'+$scope.prod.prodimgs[$scope.currentImg].imgM);
		
 		$("#img_"+$scope.prod.id).attr('src','public/prodImages/'+$scope.prod.id+'/'+$scope.prod.prodimgs[$scope.currentImg].imgM);
		 
	
				  
		$("#img_"+$scope.prod.id)
    		      .css('display', 'block')
                    .parent()
                .zoom({url: 'public/prodImages/'+$scope.prod.id+'/'+$scope.prod.prodimgs[$scope.currentImg].imgL});


	 };
	 
	 
	 
	 $scope.imgGalclick = function(){
       
        var dynamicEl = [];
	for(var i = 0; i< $scope.prod.prodimgs.length; i++){
		dynamicEl.push(
			{ "src": 'public/prodImages/'+$scope.prod.id+'/'+$scope.prod.prodimgs[i].imgL,
                       'thumb': 'public/prodImages/'+$scope.prod.id+'/'+$scope.prod.prodimgs[i].imgS
                       }
			);
        }
           


	 
			
	  lightGallery(document.getElementById('lighthouse'),{
          dynamic: true,
          thumbnail:true,
          dynamicEl: dynamicEl
         }); 

	 
	 };
				  
 $scope.currentImg = 0;
$timeout(function(){
 $scope.initialize();
},1000);
		   
         

         
 };

return directiveObj;
}]);


};