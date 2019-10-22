require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('productOptions', ['$window', '$timeout', '$location', function($window, $timeout, $location){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/productoptions';
    directiveObj.scope = {  
    			 prod: '=product',
    			 iswholesale: '=iswholesale'
                 };
    directiveObj.link = function($scope, $element, $attrs){
   	            		
	  console.log('PROD OPTION cats IN SCOPE');
	  console.log($scope.prod);
 		
             $scope.prod.selected = {};
              for (var i=0; i< $scope.prod.prodoptioncats.length; i++) {
			console.log('Prod Selected ');
			console.log($scope.prod.selected);
			$scope.prod.selected[$scope.prod.prodoptioncats[i].name] = $scope.prod.prodoptioncats[i].options[0].name;
				
		}
	console.log($scope.prod);


	   $scope.optionchanged = function(cat, opt){
		   	var imageChangedOnce = false;
		console.log(cat, opt);

		
		 

		if($scope.iswholesale){
			var  price = $scope.prod.wholesaleprice;
		}else{
			var  price = $scope.prod.baseprice;
		}
		//console.log(price);
		
		$scope.prod.price = price;
		
	
		console.log('PROD OPTION cats IN SCOPE');
		console.log($scope.prod.prodoptioncats);
		
		 for(var key in $scope.prod.prodoptioncats){
		 	
		  for (var i=0; i<$scope.prod.prodoptioncats[key].options.length; i++) {
		
		             //  if($scope.prod.options[key][i][0] === $scope.prod.selected[key][0]){
			        //       if($scope.iswholesale){
				//	 $scope.prod.price = $scope.prod.selected[key][1]*0.5 + $scope.prod.price;
				//	
				//	  $('[data-img-for-sku="'+$scope.prod.sku+'"]').each(function( index ) {
				//		  console.log('Try and update main pic to match option');
				//		  console.log($scope.prod.sku);
				//		  console.log($scope.prod.options[key][i][2]);
				//		         if(!imageChangedOnce){ 
		                //                     $(this).attr('src', $scope.prod.Simgs[$scope.prod.options[key][i][2]]);
	                         //                    console.log( index + ": " + $( this ).text() );
					//							  imageChangedOnce = true;
					//					}
	                               //              });
					 //
			///		 }else{
			//		  $scope.prod.price = $scope.prod.selected[key][1] + $scope.prod.price;
			//		 
					 
			//		  $('[data-img-for-sku="'+$scope.prod.sku+'"]').each(function( index ) {
			//			  console.log('Try and update main pic to match option');
			//			  console.log($scope.prod.sku);
			//			  console.log($scope.prod.options[key][i][2]);
			//			  console.log("OPTION IMAGE KEY");
			//			  console.log($scope.prod.options[key][i][2]);
			//									if(!imageChangedOnce){ 
		         //                            $(this).attr('src', $scope.prod.Simgs[$scope.prod.options[key][i][2]]);
	                  //                           console.log( index + ": " + $( this ).attr('src') );
				//								 imageChangedOnce = true;
				//									}
	
	                       //                      });

					//     }
		   } //for each options..
              } //for each prodoptioncats
            }; // optionchanged....
	  
        

   };

  

return directiveObj;
}]);


};