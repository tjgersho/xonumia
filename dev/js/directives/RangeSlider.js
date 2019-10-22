require('angular');
var $ = require('jquery');
require('jquery-ui');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive("rangeSlider", ['$rootScope', function ($rootScope) {
    return {
	 restrict: 'A',
	 scope: {
	 val: '=val'
	 },

        link: function (scope, element, attributes) {

              console.log('Slider Value');
		console.log(scope.val);
		$(element).append("<div id='SliderHandle' class='ui-slider-handle'></div>");
              var handle = $( "#SliderHandle" );
    $(element).css('height',  '50px');
	        
		$(element).slider({
				range: "min",
      				value: 14,
    				  min: 1,
      				max: 365,
    			    	create: function() {
       			 handle.text( $( this ).slider( "value" ) + ' Days');
				$('.ui-widget-header').css('background-color', '#31b0d5');
    			      },
     				 slide: function( event, ui ) {
                              scope.val = ui.value;
       			  handle.text( ui.value + ' Days');
				  $rootScope.$apply();
				 
      				}
    			});

		
         }
    };
}]);

};