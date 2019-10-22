require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive("pagControl", ['$window',  '$timeout', function ($window, $timeout) {
    return {
	 restrict: 'E',
  	 templateUrl: 'partials/pagcontrol',
        scope: {
            getlistpromise: "&",
	     currentpage: "=",
	     numpagespromise: "&"
        },
        link: function (scope, element, attributes) {

		console.log('PAGINATION DIRECTIVE LINK FUNCTION');
		console.log(scope);
		console.log(scope.getlistpromise);
		console.log(scope.currentpage);
		console.log(scope.numpagespromise);

        scope.getNumberOfPages = function(){  
                scope.numpagespromise().then(function(resp){
			scope.numpages = resp;
		  },function(err){

		  });
        };
	         
        scope.getNumberOfPages();

		scope.activePag = function(current){
          		if(current === scope.currentpage){
          			 return {'active': 1};
          		}else{
          			 return {'active': 0};
         	       }
        };

		scope.setPageAngGetListing = function(page){
				console.log('PagContrl Set Page');
					console.log(page);
    			$window.scroll(0,120);
    		
     			scope.currentpage = page

     				console.log('Local p');
     				console.log(scope.sp);
     				console.log('parent p');
     				console.log(scope.$parent);
     			 scope.getlistpromise({page: page});
     			
    	        };		
          
        }
    };
}]);

};