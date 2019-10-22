require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('dashConqurings', ['$window', '$state', '$http', 'Global', 'User',  function($window, $state, $http, Global, User){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/dashconqurings';
    directiveObj.scope = {
          conqurData: '='
           };

   directiveObj.link = function($scope, $element, $attrs){
   	            		
	console.log('Scope in DashConqurings');
	console.log($scope.conqurData);
	$scope.allMapsWithStartAndFinish = {};
	
	console.log('Num Concurs');
	console.log($scope.conqurData.count);
      
	$scope.loading = true;
	
	var peakConqurCount = 0;

	function mergeMappArray(){

	  for(var i=0; i<$scope.allMapsWithStartAndFinish.count; i++){
			$scope.allMapsWithStartAndFinish.rows[i].userFinished = false;
			for(var j=0; j<$scope.conqurData.count; j++){
				
			if($scope.conqurData.rows[j].howmanytimes > peakConqurCount){
				peakConqurCount = $scope.conqurData.rows[j].howmanytimes;

			}
	
			if($scope.conqurData.rows[j].id === $scope.allMapsWithStartAndFinish.rows[i].id){
				$scope.allMapsWithStartAndFinish.rows[i].userFinished = true;
				$scope.allMapsWithStartAndFinish.rows[i].howmanytimes = $scope.conqurData.rows[j].howmanytimes;
			 }
			
			}


		}

	}

	$http.get('api/v1/mapStartFinish', {headers:{auth:User.token}}).then(function(resp){
		console.log('MapStart Finish Resp');
		console.log(resp);
		$scope.allMapsWithStartAndFinish  = resp.data;
			
		mergeMappArray();
		

	},function(err){	
		console.log('MapStart Finish ERR');
		console.log(err);
		
	});

	$scope.$watch('conqurData', function(newValue, oldValue ){

		console.log('Onchange watch');
		console.log('Num Concurs');
		console.log(newValue, oldValue);
		if(newValue.count > 0){
			if($scope.loading){
			$scope.loading = false;
			//do something
			}
			
		}
	});


	$scope.dashMapBoxClass = function(id){
		for(var j=0; j<$scope.conqurData.count; j++){

			if($scope.conqurData.rows[j].id === id){
				return {'defeated': true};
			
			}
		}

		return {'undefeated': true};
	};

	    $scope.dashMapBoxConqurPercent= function(id){
		for(var j=0; j<$scope.conqurData.count; j++){

			if($scope.conqurData.rows[j].id === id){
				
				return  ($scope.conqurData.rows[j].houmanytimes / peakConqurCount)*100 + '%';
			
			}
		}

		return '0%';
	};


   };

  

return directiveObj;
}]);


};