require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                //scope.$apply(function () {
                    scope.fileread = changeEvent.target.files;
                    //console.log("FILE READ");
                    //console.log(scope.fileread);
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                //});
            });
        }
    };
}]);

};