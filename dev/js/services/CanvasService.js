//Global Variables Service

require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Canvas', ['Global', 'Matrix', function(Global, Matrix){

var throttle = function(func, limit) {
  var inThrottle,
    lastFunc,
    throttleTimer;
  return function() {
    var context = this,
      args = arguments;
    if (inThrottle) {
      clearTimeout(lastFunc);
      return lastFunc = setTimeout(function() {
        func.apply(context, args);
        inThrottle = false;
      }, limit);
    } else {
      func.apply(context, args);
      inThrottle = true;
      return throttleTimer = setTimeout(function() {
        return inThrottle = false;
      }, limit);
    }
  };
};

class Canvas {
    constructor(params) {
        this.directionLock = false;
        this.target = Global.target;
        this.reenviar = true;
        this.directions = [];
        this.clickPos = Global.clickPos;
        this.isAdvClick = Global.isAdvClick;
	 this.isAdvClickforLink = Global.isAdvClickforLink;
        var self = this;

        this.cv = document.getElementById('cvs');
        this.cv.width = Global.screenWidth;
        this.cv.height = Global.screenHeight;
        this.cv.addEventListener('mousemove', throttle(this.gameInputMouseMove, 200), false);
        this.cv.addEventListener('mouseup', this.gameInputMouseUp, false);
        this.cv.addEventListener('mouseout', this.outOfBounds, false);
        this.cv.addEventListener('keypress', this.keyInput, false);
        this.cv.addEventListener('keyup', function(event) {
            self.reenviar = true;
            self.directionUp(event);
        }, false);
        this.cv.addEventListener('keydown', this.directionDown, false);


        this.cv.addEventListener('touchstart', this.touchInput, false);
        this.cv.addEventListener('touchmove', function(e){}, false);
        this.cv.addEventListener('touchend', this.touchUp, false);

      //  this.cv.addEventListener('touchmove', this.touchInput, false)
        this.cv.parent = self;
        Global.canvas = this;
    }
    

    // Function called when a key is pressed, will change direction if arrow key.
    directionDown(event) {
        var key = event.which || event.keyCode;
        var self = this.parent; // have to do this so we are not using the cv object
        if (self.directional(key)) {
            self.directionLock = true;
            if (self.newDirection(key, self.directions, true)) {
                self.updateTarget(self.directions);
           
            }
        }
    }

    // Function called when a key is lifted, will change direction if arrow key.
    directionUp(event) {
        var key = event.which || event.keyCode;
        if (this.directional(key)) { // this == the actual class
            if (this.newDirection(key, this.directions, false)) {
                this.updateTarget(this.directions);
                if (this.directions.length === 0) this.directionLock = false;
            }
        }
    }

    // Updates the direction array including information about the new direction.
    newDirection(direction, list, isAddition) {
        var result = false;
        var found = false;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] == direction) {
                found = true;
                if (!isAddition) {
                    result = true;
                    // Removes the direction.
                    list.splice(i, 1);
                }
                break;
            }
        }
        // Adds the direction.
        if (isAddition && found === false) {
            result = true;
            list.push(direction);
        }

        return result;
    }

    // Updates the target according to the directions in the directions array.
    updateTarget(list) {
        this.target = { x : 0, y: 0 };
        var directionHorizontal = 0;
        var directionVertical = 0;
        for (var i = 0, len = list.length; i < len; i++) {
            if (directionHorizontal === 0) {
                if (list[i] == Global.KEY_LEFT) directionHorizontal -= Number.MAX_VALUE;
                else if (list[i] == Global.KEY_RIGHT) directionHorizontal += Number.MAX_VALUE;
            }
            if (directionVertical === 0) {
                if (list[i] == Global.KEY_UP) directionVertical -= Number.MAX_VALUE;
                else if (list[i] == Global.KEY_DOWN) directionVertical += Number.MAX_VALUE;
            }
        }
        this.target.x += directionHorizontal;
        this.target.y += directionVertical;
        Global.target = this.target;
    }

    directional(key) {
        return this.horizontal(key) || this.vertical(key);
    }

    horizontal(key) {
        return key == Global.KEY_LEFT || key == Global.KEY_RIGHT;
    }

    vertical(key) {
        return key == Global.KEY_DOWN || key == Global.KEY_UP;
    }

    gameInputMouseUp(mouse){
         var self = this.parent;
         var mscreen = [mouse.clientX, mouse.clientY, 1];
         var scrnMap =  Matrix.inverseMap(mscreen);
         this.clickPos = {x: scrnMap[0], y: scrnMap[1]};
         Global.clickPos = this.clickPos;
         self.advClickCheck(this.clickPos);

        if (!this.directionLock) {
            this.parent.target.x = mouse.clientX - this.width / 2;
            this.parent.target.y = mouse.clientY - this.height / 2;
            Global.target = this.parent.target;
        }
    }

    gameInputMouseMove(mouse) {
        if (!this.directionLock) {
            this.parent.target.x = mouse.clientX - this.width / 2;
            this.parent.target.y = mouse.clientY - this.height / 2;
            Global.target = this.parent.target;
        }
    }
    touchUp(touch){
        console.log(touch);
         var self = this.parent;
           var touches = touch.changedTouches;
         var tscreen = [touches[0].clientX, touches[0].clientY, 1];
         var scrnMap =  Matrix.inverseMap(tscreen);
         this.clickPos = {x: scrnMap[0], y: scrnMap[1]};
         Global.clickPos = this.clickPos;
         
	   self.advClickCheck(this.clickPos);
       
        if (!this.directionLock) {
            this.parent.target.x = touches[0].clientX - this.width / 2;
            this.parent.target.y = touches[0].clientY - this.height / 2;
            Global.target = this.parent.target;
        }
    }
    touchInput(touch) {
        touch.preventDefault();
        touch.stopPropagation();
        if (!this.directionLock) {
            this.parent.target.x = touch.touches[0].clientX - this.width / 2;
            this.parent.target.y = touch.touches[0].clientY - this.height / 2;
            Global.target = this.parent.target;
        }
    }

    // Chat command callback functions.
    keyInput(event) {
      console.log('KEY DOWN');

    }
    advClickCheck(clkPos){
	
      var advlength = Global.advs.length;
	
      for(var i = 0; i< advlength; i++){
        
                if((clkPos.x <= (Global.advs[i].locX+Global.advs[i].width - 0.5) && 
                    clkPos.x >= (Global.advs[i].locX - 0.5) && 
                        clkPos.y <= (Global.advs[i].locY + 0.5) && 
                            clkPos.y >= (Global.advs[i].locY-Global.advs[i].height + 0.5)) &&
					 Global.advs[i].available &&
					 !Global.advs[i].sponsorshipInterest &&
					Global.advs[i].img === 'sponsorshipavailable.png'
	                  ){
			       console.log("CLICK IS IN");
				 this.isAdvClick = true;
				 Global.isAdvClick =  true;

                            Global.advBuy = Global.advs[i];

                             break;

                }

		 if((clkPos.x <= (Global.advs[i].locX+Global.advs[i].width - 0.5) && 
                    clkPos.x >= (Global.advs[i].locX - 0.5) && 
                        clkPos.y <= (Global.advs[i].locY + 0.5) && 
                            clkPos.y >= (Global.advs[i].locY-Global.advs[i].height + 0.5)) &&
					 !Global.advs[i].available &&
					 Global.advs[i].hasLink &&
					Global.advs[i].link !== ''
	                  ){
			       console.log("CLICK IS IN");
				this.isAdvClickforLink  = true;
				Global.isAdvClickforLink  = true;
                            Global.advClickforLink = Global.advs[i];


                     break;

                }
  
        }

     }
   

}

var service = {};

service.getCanvas = function(){

var canvas = new Canvas();
//console.log(canvas)
   return canvas;
};

return service;

}]);

};