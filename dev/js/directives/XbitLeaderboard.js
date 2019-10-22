require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive("xbitLeaderboard", ['$rootScope', '$http', '$timeout', function ($rootScope, $http, $timeout) {
    return {
	 restrict: 'E',
	 scope: {
	   lb: '=vals'
        },
	 templateUrl: 'partials/xbitleaderboard',
	link: function (scope, element, attributes) {

              var rowHeightFactor = 20;
		
		var leaderboardScroll = $('#xbitleaderBoardScroll');

		leaderboardScroll.css('position', 'relative');
		
		self.tm = 0;

		self.scollpixelcount = 0;
              
            function animation(){
		self.tm = self.tm + 0.1;
		if(self.tm > 3){

			self.scollpixelcount = self.scollpixelcount + 1; 
		}
			if(self.scollpixelcount > scope.lb.length * rowHeightFactor){
				self.tm = 0;
				self.scollpixelcount = 0;
                      }

    			leaderboardScroll.css('top', '-'+ self.scollpixelcount + 'px');
	      }

		
		var cancelRefresh;
		self.animateStuff = function() {
    		cancelRefresh = $timeout(function myFunction() {
      			 animation();
       		 cancelRefresh = $timeout(self.animateStuff, 1000/30);
    			},1000/30);
		};

		scope.$on('$destroy', function(e) {
		console.log("YESSS ANIMATION DESTROYED !! NO MEMORY LEAD HOPEFULLY");
      		  $timeout.cancel(cancelRefresh);
		});

		self.animateStuff();

		$('#xBitleaderBoardTab').click(function(){
			self.tm = 0;
			self.scollpixelcount = 0;
		});

		
         }
    };
}]);

};