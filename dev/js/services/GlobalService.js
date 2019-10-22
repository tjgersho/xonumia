///Global Variables Service

require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Global', function(){


    //console.log("Global Service");
var service = {
    // Keys and other mathematical constants
    KEY_ESC: 27,
    KEY_ENTER: 13,
    KEY_CHAT: 13,
    KEY_FIREFOOD: 119,
    KEY_SPLIT: 32,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_TAB: 10000,
    borderDraw: true,
    spin: -Math.PI,
    enemySpin: -Math.PI,
    mobile: false,
    xnumSides: 6,
   
    // Canvas
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    gameWidth: 0,
    gameHeight: 0,
    xoffset: -0,
    yoffset: -0,
    gameStart: false,
    disconnected: false,
    died: false,
    kicked: false,
    continuity: false,
    startPingTime: 0,
    toggleMassState: 0,
    backgroundColor: '#f2fbff',
    lineColor: '#ccc',
    target: {x: 0.5, y: 0.5},
    clickPos: {x: null, y: null},
    advs: [],
    isAdvClick: false,
    advBuy: {},
    isAdvClickforLink: false,
    advClickforLink: {},
    screen_min_dim: function(){
        return  ((this.screenHeight<=this.screenWidth) ?  this.screenHeight : this.screenWidth);
    },
    screenCellsWidth: 20,
    screenCellsHeight: 20,
    updateScreenDims: function(){
        service.screenWidth = window.innerWidth;
        service.screenHeight = window.innerHeight;
    },

  };


return service;
});

};
