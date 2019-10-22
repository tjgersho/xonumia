require('angular');
require('angular-ui-router');
var $ = require('jquery');

//var io = require('socket.io-client');


require('../../libs/spectrum.js');


//import 'bootstrap/dist/js/bootstrap';


module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('BuilderController', 
	['$window', '$http', '$q', '$state', 'Global', 'User',  '$rootScope', '$timeout', 'Matrix',  'Levels', 'Draw', 'Auth',

    function($window, $http, $q, $state, Global, User,  $rootScope, $timeout, Matrix, Levels, Draw, Auth){
    //console.log("XonumiaController");
var self = this;

console.log("BODY OF BUILDER CONTROLLER CALLED");


 $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
       //console.log('StateChangeStart');
       //console.log(event);
       //console.log(toState);
       //console.log(toParams);
       //console.log(fromState);
       //console.log(fromParams);
       //console.log(options);

 });


//Matrix.scale(2.0);




var zoom = 100;
var cellCountInView = 20;

var viewOffsetX = 0;
var viewOffsetY = 0;

var centerX = 0;
var centerY = 0;

var viewBoundBufferThreashold = [];

var selectCells = [];

var hoverCell = [];
var map = {};

var cvstemp;
var tempCtx;


map.tiles = [];
map.start = [];
map.finish = [];

var mapBuilds = [];
self.levels = [];

self.levelSelect = '1';

var levelName = document.getElementById('addLevel');
self.levelSelectName = '';

self.thereIsAModalOpen = false;

self.isCrowdSourced = false;
self.crowdSourceAble = function(){

	if(parseInt(self.levelSelect) < 30){
		return false;
	}

	var levelArryLen = self.levels.length;

	for (var i = 0; i<levelArryLen; i++){
		if(parseInt(self.levelSelect) === self.levels[i].id){
			if(self.levels[i].userId === 0){
				return false;
			}
			if(self.levels[i].userId === User.id){
				return true;
			}
			
		}
	}
	
  return false;

};


  self.isAdmin = false;
Auth.adminAuthenticate().then(function(resp){
  self.isAdmin = true;
});


var advs = [];

var loadingGif = $('#loading');



function drawWorld() {
    self.initScreen();
   
 
   var ctx = c.getContext("2d"); 
 //   ctx.fillStyle = "#222";
   // ctx.fillRect(0, 0,  c.width,  c.height);
  ctx.clearRect(0, 0, c.width,c.height);
   
   if(zoom > 180){
    Draw.drawGrid(ctx, zoom);
    }
     Draw.drawWorldCoordinateSystem(ctx, zoom);

 
      Draw.drawMap(ctx, map);

  Draw.drawAdvs(ctx, advs, zoom, tempCtx);

   if(!!map.start[0] && !!map.start[1]){ 
     Draw.drawStartCell(ctx, map.start);
   }

   if(!!map.finish[0] && !!map.finish[1]){ 
     Draw.drawFinishCell(ctx, map.finish);
    } 
    
     
   

     Draw.drawSelectedCells(ctx, selectCells);
 

    Draw.drawHoverCell(ctx, hoverCell);


}



function addToSelectCellList(obj){

var isin = false;

var numinSelectCells = selectCells.length;

for(var i=0; i< numinSelectCells; i++){
  if(obj.locX === selectCells[i].locX && obj.locY === selectCells[i].locY){
  isin = true;
  break;
}
}

if(!isin){
  selectCells.push(obj);
}


}

self.setTilesAsAdvTiles = function(locX, locY, width, height){


  for (var i=0; i<width; i++){

    for(var j=0; j<height; j++){
      var tileObj = {locX: (locX + i), locY: (locY - j), isAdv: true, color_r: 255, color_g: 255, color_b: 255, color_a: 0, mapId: parseInt(self.levelSelect)};

       
            var tileXhrCallConfig = {
                  method : 'POST',
                  url: 'api/v1/tile',
                  data: tileObj,
                  headers: {auth: User.token},
                  responseType: "json"
              };

            setTilesHTTPcall(tileXhrCallConfig);

             addAdvToMap(tileObj);

    }


  }
 loadingGif.hide();

  advs.push({locX:locX, locY:locY, width:width, height:height, img: 'sponsorshipavailable.png', available: true});
   drawWorld();


};

function setTilesHTTPcall(tileXhrCallConfig){
          $http(tileXhrCallConfig).then(function(resp){
              
                  loadingGif.hide();
                
             }, function(err){
                      console.log('SAVING ERR');
                         console.log(err);
                        loadingGif.hide();
                        
             });
}

self.removeAdvFromTiles = function(locX, locY, width, height){


  for (var i=0; i<width; i++){

    for(var j=0; j<height; j++){
      var tileObj = {locX: (locX + i), locY: (locY - j), isAdv: false, color_r: 0, color_g: 0, color_b: 0, color_a: 0, mapId: parseInt(self.levelSelect)};

       
            var tileXhrCallConfig = {
                  method : 'POST',
                  url: 'api/v1/tile',
                  data: tileObj,
                  headers: {auth: User.token},
                  responseType: "json"
              };

             removeAdvFromTilesXhr(tileXhrCallConfig);

             removeAdvFromMap(tileObj);

    }


  }
 loadingGif.hide();
console.log('ADV before filter');
console.log(advs);

 advs = advs.filter(function(a){
    if(a.locX === locX && a.locY === locY){
      return false;
    }
    return true;
  });

console.log(advs);

  drawWorld();


};

function removeAdvFromTilesXhr(tileXhrCallConfig){
  $http(tileXhrCallConfig).then(function(resp){
              
                  loadingGif.hide();
                
             }, function(err){
                      console.log('SAVING ERR');
                         console.log(err);
                        loadingGif.hide();
                        
             });
}


function removeAdvFromMap(obj){
var isin = false;

var numinArr = map.tiles.length;
for(var i=0; i< numinArr; i++){
  if(obj.locX === map.tiles[i].locX && obj.locY === map.tiles[i].locY){
   
            map.tiles[i].color_a = 0.0;

  break;
}
}


} 
self.deleteAdvInstance = function(){

  var deleteAdvXhrCallConfig = {
                method : 'DELETE',
                url: 'api/v1/adv/?locX='+self.removeAdvIs.locX+'&locY='+self.removeAdvIs.locY,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(deleteAdvXhrCallConfig).then(function(resp){

              console.log('DELETE ADv ', resp);
                loadingGif.hide();
           }, function(err){
              
                    console.log('SAVING ERR');
                       console.log(err);
                      loadingGif.hide();
           });
};

self.deleteAdvForSure = function(){
  self.deleteAdvInstance();
 $('#deleteAdvWarningModal').modal('hide');
  self.removeAdvFromTiles(self.removeAdvIs.locX, self.removeAdvIs.locY, self.removeAdvIs.width, self.removeAdvIs.height);
   loadingGif.hide();
  self.thereIsAModalOpen = false;
   
};

function addAdvToMap(obj){
var isin = false;

var numinArr = map.tiles.length;
for(var i=0; i< numinArr; i++){
  if(obj.locX === map.tiles[i].locX && obj.locY === map.tiles[i].locY){
   
      map.tiles[i].color_r = obj.color_r;
        map.tiles[i].color_g = obj.color_g;
          map.tiles[i].color_b = obj.color_b;
            map.tiles[i].color_a = obj.color_a;

  isin = true;
  break;
}
}

if(!isin){


  map.tiles.push(obj);
}

} 


function addToMap(obj){
var isin = false;
var isinBuilds = false;
var numinArr = map.tiles.length;
 var numinBArr = mapBuilds.length;
 var k=0;
for(var i=0; i< numinArr; i++){
  if(obj.locX === map.tiles[i].locX && obj.locY === map.tiles[i].locY){
   
    if(obj.upclick === 1){
      map.tiles[i].gu = !map.tiles[i].gu; 
    }
     if(obj.rightclick === 1){
      map.tiles[i].gr = !map.tiles[i].gr;
    }
     if(obj.downclick === 1){
      map.tiles[i].gd = !map.tiles[i].gd;
    }
     if(obj.leftclick === 1){
      map.tiles[i].gl = !map.tiles[i].gl;
    }

      map.tiles[i].color_r = self.color_r_selected;
        map.tiles[i].color_g = self.color_g_selected;
          map.tiles[i].color_b = self.color_b_selected;
            map.tiles[i].color_a = self.color_a_selected;

     isinBuilds = false;
      numinBArr = mapBuilds.length;
      for(k=0; k< numinBArr; k++){
                if(mapBuilds[k] === i){
                  isinBuilds = true;
                }

        }
        if(!isinBuilds){
          mapBuilds.push(i);
        }
   

  isin = true;
  break;
}
}

if(!isin){
  if(obj.upclick === 1){
  obj.gu = true;
    }else{
  obj.gu = false;
    }

  if(obj.rightclick === 1){
   obj.gr = true;
  }else{
   obj.gr = false;
  }

   if(obj.downclick === 1){
    obj.gd = true;
   }else{
    obj.gd = false;
   }

   if(obj.leftclick === 1){
    obj.gl = true;
   }else{
    obj.gl = false;
   }
 obj.color_r = self.color_r_selected;
         obj.color_g = self.color_g_selected;
           obj.color_b = self.color_b_selected;
             obj.color_a = self.color_a_selected;

     isinBuilds = false;
      numinBArr = mapBuilds.length;
      for(k=0; k< numinBArr; k++){
                if(mapBuilds[k] === map.tiles.length){
                  isinBuilds = true;
                }

        }
        if(!isinBuilds){
          mapBuilds.push(i);
        }
   
  map.tiles.push(obj);
}

obj.upclick = 0;
obj.rightclick = 0;
obj.downclick = 0;
obj.leftclick = 0;
} 





function syncSuroundingCell(obj, type, mapID){



var isin = false;

var numinArr = map.tiles.length;
for(var i=0; i< numinArr; i++){
  if(obj.locX === map.tiles[i].locX && obj.locY === map.tiles[i].locY){
   

    switch (type){
  case "upper":
  map.tiles[i].gd = map.tiles[mapID].gu;
    break;
  case "right":

 map.tiles[i].gl = map.tiles[mapID].gr;
    break;
  case "lower":
 map.tiles[i].gu = map.tiles[mapID].gd;
    break;
  case "left":
   map.tiles[i].gr = map.tiles[mapID].gl;
    break;
 }


   
   mapBuilds.push(i);

  isin = true;
  break;
}
}


if(!isin){


    switch (type){
  case "upper":
  obj.gd = map.tiles[mapID].gu;
    break;
  case "right":

 obj.gl = map.tiles[mapID].gr;
    break;
  case "lower":
 obj.gu = map.tiles[mapID].gd;
    break;
  case "left":
   obj.gr = map.tiles[mapID].gl;
    break;

 }

   obj.color_r = 0;
    obj.color_g = 0;
     obj.color_b = 0;
  obj.color_a = 0;

  mapBuilds.push(map.tiles.length);
  map.tiles.push(obj);
}

}










function setMatrix(){
     Matrix.reset();
  if(Global.screenWidth > Global.screenHeight){

        Matrix.scale([1/cellCountInView*(zoom/100)*Global.screenHeight, -1/cellCountInView*(zoom/100)*Global.screenHeight, 1]);  //Flips device coords to logical coors Y UP
        Matrix.translate([0, Global.screenHeight, 0]); // Moves Draw COORDS down to bottom left of device
      
        Global.screenCellsWidth  = (Global.screenWidth/Global.screenHeight)*cellCountInView*(100/80);
        Global.screenCellsHeight = cellCountInView*(100/80);


    }else{

        Matrix.scale([1/cellCountInView*(zoom/100)*Global.screenWidth, -1/cellCountInView*(zoom/100)*Global.screenWidth, 1]);  //Flips device coords to logical coors Y UP
        Matrix.translate([0, Global.screenWidth*(Global.screenHeight/Global.screenWidth), 0]); // Moves Draw COORDS down to bottom left of device
    
         Global.screenCellsWidth  = cellCountInView*(100/80); 
         Global.screenCellsHeight = (Global.screenWidth/Global.screenHeight)*cellCountInView*(100/80);

    }

         Matrix.translate([Global.screenWidth/2, -Global.screenHeight/2, 0]);  //// Makes View Local Coordinates Center Screen
         Matrix.translate([viewOffsetX*(zoom/100), viewOffsetY*(zoom/100), 0]);   //Moves Screen to Offset Position
     
      getCenter();
      checkMapBuffer();

}

angular.element($window).bind('resize', function(){
 //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('build')){
       Global.updateScreenDims();

        setMatrix();
        drawWorld();
    }
});

function getCenter(){
 var c = Matrix.inverseMap([viewOffsetX, viewOffsetY, 0]);

 centerX = -c[0];
 centerY = -c[1];

}

function  viewBoundBufferThreasholdReset(){
	 viewBoundBufferThreashold =  [centerY + Global.screenCellsHeight, 
									centerX + Global.screenCellsWidth, 
										centerY - Global.screenCellsHeight, 
											centerX - Global.screenCellsWidth];

}


function checkMapBuffer(){
  if(viewBoundBufferThreashold[0] === undefined){
      viewBoundBufferThreasholdReset();
  }

  if(viewBoundBufferThreashold[0] < centerY ||
	viewBoundBufferThreashold[1] < centerX ||
		viewBoundBufferThreashold[2] > centerY ||
			viewBoundBufferThreashold[3] > centerX ){

                      viewBoundBufferThreasholdReset(); 
			 getMapTiles();
			  
    			  
   }


}


var shiftKEY = false;
var mouseDownForMove = false;
var mouseDownForSELECT = false;
var controllKEY = false;

var moveStartX  = 0;
var moveStartY = 0;

var moveEndX = 0;
var moveEndY = 0;

var startPinch = 0;
var movePinch = 0;



var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
 

function wheelZoom(e){
   var evt=window.event || e;//equalize event object
  var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; //delta returns +120 when wheel is scrolled up, -120 when scrolled down
  //console.log("Wheel Zoom");
  //console.log(zoom);

  if(typeof(delta) === 'number'){
    zoom = zoom + parseInt(delta/12);
  }
 // console.log(zoom);

  if(zoom < 80){
    zoom = 80;
  }
  if(zoom > 400){
    zoom = 400;
  }
   if (evt.preventDefault) {//disable default wheel action of scrolling page
        evt.preventDefault();
    }else{
        return false;
  }
   setMatrix();
    drawWorld();
}

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

var c = document.getElementById("buildcvs");

self.initScreen = function(){

Global.updateScreenDims();

c.width = Global.screenWidth;

c.height = (Global.screenHeight);

cvstemp = document.getElementById('cvsBuildTempMemory');
cvstemp.width = Global.screenWidth;
cvstemp.height = Global.screenHeight;

tempCtx = cvstemp.getContext('2d');


};


if (c.attachEvent) {//if IE (and Opera depending on user setting)
   
     c.attachEvent("on"+mousewheelevt,  throttle(wheelZoom,100));

}else if (c.addEventListener){ //WC3 browsers
 
 c.addEventListener(mousewheelevt,  throttle(wheelZoom, 100), false);
  c.addEventListener("touchstart", handleTouchStart, false);
  c.addEventListener("touchmove", throttle(handleTouchMove, 100), false);

}
// c.addEventListener("touchend", handleTouchUp, false);

 

angular.element(window).bind('keydown', xonumiaKeyDown);

var wasPinch;
function handleTouchStart(e){
    var touches = e.changedTouches;
    
      if(touches.length === 1){
      moveStartX = touches[0].pageX;
      moveStartY = touches[0].pageY;

      moveEndX = touches[0].pageX;
      moveEndY = touches[0].pageY;
	if(wasPinch){
		$timeout(function(){wasPinch = false;},300);
	}
    }
      if(touches.length === 2){
        startPinch = Math.sqrt(Math.pow((touches[0].pageX - touches[1].pageX),2)  + Math.pow((touches[0].pageY - touches[1].pageY),2));
	 
        pinchZoom(e);
        wasPinch = true;
        }

}

function pinchZoom(e){
  var touches = e.changedTouches;

  movePinch = Math.sqrt(Math.pow((touches[0].pageX - touches[1].pageX),2)  + Math.pow((touches[0].pageY - touches[1].pageY),2));

  var delta = 2 * (movePinch - startPinch);

  startPinch = movePinch;

  if(typeof(delta) === 'number'){
    zoom = zoom + parseInt(delta)*0.5;
  }
 // console.log(zoom);

  if(zoom < 60){
    zoom = 60;
  }
  if(zoom > 200){
    zoom = 200;
  }
   
   setMatrix();
   drawWorld();
}



function handleTouchMove(e){
 
   e.preventDefault();

  var touches = e.changedTouches;
	//console.log(e.changedTouches);
if(touches.length === 1 && !wasPinch){
      moveEndX = touches[0].pageX;
      moveEndY = touches[0].pageY;

      var deltaX = moveEndX - moveStartX;
      var deltaY = moveEndY - moveStartY;


      moveStartX = moveEndX;
      moveStartY = moveEndY;



       viewOffsetX =  viewOffsetX + parseInt(deltaX);
       viewOffsetY = viewOffsetY + parseInt(deltaY);
  }
  if(touches.length === 2){
   pinchZoom(e);
   wasPinch = true;
  }
      // console.log("MOUSE EVENT ");
       //console.log(e);
       setMatrix();
       drawWorld();
 

}

// function handleTouchUp(e){
 // e.preventDefault();
//  alert("HELLO TOUCH UP>>> in BUILDR");

//   var touches = e.changedTouches;

//   if(touches.length === 1){ 

//  var mscreen = [touches[0].pageX, touches[0].pageY, 1];
//    var scrnMap =  Matrix.inverseMap(mscreen);
//    var click = {x: scrnMap[0], y: scrnMap[1]};

//    if(self.inAdvClick(click)){
//        loadingGif.show();
		
//         $('#deleteAdvWarningModal').modal('show');  
//    }
//  }

//}

function xonumiaKeyDown(e){

if(!self.thereIsAModalOpen){
  //console.log('ViewoffsetX Y');
 // console.log(viewOffsetX, viewOffsetY);
  //  console.log('centerX Y');
   // console.log(centerX, centerY);
  var redraw = false;


   if(e.key === "+" || e.key === "=" || e.keyCode === 187){
    //console.log("ZOOM IN");
     zoom += 10;
     redraw = true;
   }

  if(e.code === "Minus" || e.keyCode === 189){
      //console.log("ZOOM OUT");
     zoom -= 10;
     redraw = true;
   }

  if(zoom < 60){
    zoom = 60;
       
  }
  if(zoom > 200){
    zoom = 200;
      
  }
  
  //console.log(e);
  if(e.key === 'Shift' || e.keyCode === 16){
    shiftKEY = true;
      
  }

  if(e.key === 'Control' || e.keyCode === 17){
     controllKEY = true;

  }
 

 var saveSelCellsBool = false;

 if(e.key === 'w' || e.keyCode === 87){
  selectCells.forEach(function(c){
      c.upclick = 1;
  });
   redraw = true;
   saveSelCellsBool = true;
}
 
 if(e.key === 'a' || e.keyCode === 65){
  selectCells.forEach(function(c){
   c.leftclick = 1;
  });
   redraw = true;
   saveSelCellsBool = true;
}
  if(e.key === 's' || e.keyCode === 83){
  selectCells.forEach(function(c){
    c.downclick = 1;
  });
   redraw = true;
   saveSelCellsBool = true;
}

  if(e.key === 'd' || e.keyCode === 68){
  selectCells.forEach(function(c){
    c.rightclick = 1;
  });
   redraw = true;
   saveSelCellsBool = true;
   }
  


   if(e.key === 'c' || e.keyCode === 67){
 selectCells.forEach(function(c){
    c.color_r = self.color_r_selected;
    c.color_g = self.color_g_selected;
    c.color_b = self.color_b_selected;
    c.color_a = self.color_a_selected;
  });
   redraw = true;
   saveSelCellsBool = true;

   }

   if((e.key === 'p' || e.keyCode === 80) && selectCells.length === 1){
    self.addAdvModal();
   }

   if((e.key === 'g' || e.keyCode === 71) && selectCells.length === 1){
    console.log(selectCells[0].locX, selectCells[0].locY);
    self.addstartCell(selectCells[0].locX, selectCells[0].locY);
   }

   if((e.key === 'f' || e.keyCode === 70) && selectCells.length === 1){
    self.addfinishCell(selectCells[0].locX, selectCells[0].locY);
   }

   if(saveSelCellsBool){
     saveSelectCells();
   }

  if(redraw){
   
    setMatrix();
    drawWorld();

  }
 }
}




self.wallUp = function(){
selectCells.forEach(function(c){
      c.upclick = 1;
  });
    saveSelectCells();
    setMatrix();
    drawWorld();
};

self.wallRight = function(){
selectCells.forEach(function(c){
    c.rightclick = 1;
  });
  saveSelectCells();
    setMatrix();
    drawWorld();

};

self.wallDown = function(){

 selectCells.forEach(function(c){
    c.downclick = 1;
  });
    saveSelectCells();
    setMatrix();
    drawWorld();
};

self.wallLeft = function() {
selectCells.forEach(function(c){
   c.leftclick = 1;
  });

  saveSelectCells();
    setMatrix();
    drawWorld();
};

self.color = function(){
selectCells.forEach(function(c){
    c.color_r = self.color_r_selected;
    c.color_g = self.color_g_selected;
    c.color_b = self.color_b_selected;
    c.color_a = self.color_a_selected;
  });
    saveSelectCells();
    setMatrix();
    drawWorld();
};

self.setStartCell = function() {
  if(selectCells.length === 1){
    self.addstartCell(selectCells[0].locX, selectCells[0].locY);
  }

};

self.setEndCell = function() {
if(selectCells.length === 1){
  self.addfinishCell(selectCells[0].locX, selectCells[0].locY);
}
};

$('body').on('contextmenu', '#buildcvs', function(e){return false;});

angular.element(c).bind('keyup', function(e){

if(e.key === 'Shift'){
    shiftKEY = false;
    mouseDownForSELECT = false;
  }


 if(e.key === 'Control'){
     controllKEY = false;
      mouseDownForMove = false;
  }


});

angular.element(c).bind('mousedown', function(e){

var click = [];
var localCoordClick = [];
  var singleClickCell = [];
    if( shiftKEY && !controllKEY){  
      //console.log("MOUSE EVENT ");
     // console.log(e);
       mouseDownForSELECT = true;
      click =  [e.offsetX, e.offsetY, 1];
     localCoordClick = Matrix.inverseMap(click);
     singleClickCell  = findNearestCell(localCoordClick);
       addToSelectCellList({locX: singleClickCell[0], locY: singleClickCell[1]});
      drawWorld();

    }else if(controllKEY && !shiftKEY){

      
      mouseDownForMove = true;
      moveStartX = e.offsetX;
      moveStartY = e.offsetY;
      moveEndX = e.offsetX;
      moveEndY = e.offsetY;



    }else{   
   
   click =  [e.offsetX, e.offsetY, 1];

   localCoordClick = Matrix.inverseMap(click);

    //Find Nearest Cell .5, .5///


    selectCells = [];
   singleClickCell  = findNearestCell(localCoordClick);

    addToSelectCellList({locX: singleClickCell[0], locY: singleClickCell[1]});

    drawWorld();

    }


});
 self.removeAdvIs = {};
self.inAdvClick = function(clkPos){

        var isin = false;
		var advLength = advs.length;
       
          for(var i =0; i<advLength; i++){
              
                if((clkPos.x <= (advs[i].locX+advs[i].width - 0.5) && 
                    clkPos.x >= (advs[i].locX - 0.5) && 
                        clkPos.y <= (advs[i].locY + 0.5) && 
                            clkPos.y >= (advs[i].locY-advs[i].height + 0.5)) && advs[i].available){

                   self.removeAdvIs = advs[i];
                   isin = true;
		     break;
                }else{
                   isin = false;
                }
            

        }

        if(!!isin){
            return true;
        }else{
            return false;
        }
 };

angular.element(c).bind('mouseup', function(e){
  // e.preventDefault();
  // e.stopImmediatePropagation();
    //console.log("MOUSE EVENT ");
    //console.log(e);
   // mouseDownForMove = false;
   // mouseDownForSELECT = false;
 
   var mscreen = [e.offsetX, e.offsetY, 1];
   var scrnMap =  Matrix.inverseMap(mscreen);
   var click = {x: scrnMap[0], y: scrnMap[1]};

   if(self.inAdvClick(click)){
       loadingGif.show();
            self.thereIsAModalOpen = true;
		 $('#deleteAdvWarningModal').modal({backdrop: 'static', keyboard: false});
        $('#deleteAdvWarningModal').modal('show');  
   }


});

angular.element(c).bind('mousemove', throttle(function(e){

  var hover = [];
   var localCoordHover = [];
    if(mouseDownForMove){

      moveEndX = e.offsetX;
      moveEndY = e.offsetY;

      var deltaX = moveEndX - moveStartX;
      var deltaY = moveEndY - moveStartY;


      moveStartX = moveEndX;
      moveStartY = moveEndY;



       viewOffsetX =  viewOffsetX + parseInt(deltaX);
       viewOffsetY = viewOffsetY + parseInt(deltaY);
    

      // console.log("MOUSE EVENT ");
       //console.log(e);
       setMatrix();
    

    }else if(mouseDownForSELECT){

        hover =  [e.offsetX, e.offsetY, 1];
        localCoordHover = Matrix.inverseMap(hover);
          var hoverCellCoord  = findNearestCell(localCoordHover);

          addToSelectCellList({locX: hoverCellCoord[0], locY: hoverCellCoord[1]});
          
         
    }else{


     hover =  [e.offsetX, e.offsetY, 1];
    
    localCoordHover = Matrix.inverseMap(hover);

    //Find Nearest Cell .5, .5///

      hoverCell = findNearestCell(localCoordHover);
     
     
     

    }

 drawWorld();

}, 100));




function findNearestCell(v){


var upperX = Math.ceil(v[0]);
//var lowerX = Math.floor(v[0]);

var upperY = Math.ceil(v[1]);
//var lowerY = Math.floor(v[1]);

return [(upperX - 0.5), (upperY - 0.5), 1 ];

}


function saveSelectCells(){
  selectCells.forEach(function(tile){
    //console.log("SaveSelectCells");
    //console.log(tile);
        addToMap(tile);
    });

}

$('#saveMapBtn').click(function(){

  loadingGif.show();

mapBuilds.forEach(function(i){

    var upperSync = {'locX': map.tiles[i].locX, 'locY': map.tiles[i].locY + 1};

    syncSuroundingCell(upperSync, "upper", i);

    var rightSync = {'locX': map.tiles[i].locX + 1, 'locY': map.tiles[i].locY};

    syncSuroundingCell(rightSync, "right", i);

    var lowerSync = {'locX': map.tiles[i].locX, 'locY': map.tiles[i].locY - 1};

    syncSuroundingCell(lowerSync, "lower", i);

    var leftSync = {'locX': map.tiles[i].locX - 1, 'locY': map.tiles[i].locY};

    syncSuroundingCell(leftSync, "left", i);

});

loadingGif.hide();
mapBuilds.forEach(function(i){


loadingGif.show();
map.tiles[i].mapId = parseInt(self.levelSelect);

          var tileXhrCallConfig = {
                method : 'POST',
                url: 'api/v1/tile',
                data: map.tiles[i],
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(tileXhrCallConfig).then(function(resp){
            
                loadingGif.hide();
           }, function(err){
                    console.log('SAVING ERR');
                       console.log(err);
                      loadingGif.hide();
           });
}); 
     
 mapBuilds = [];  ///Clear anything that has been updated.

});

function getMapTiles(){

  loadingGif.show();
  //map.tiles = [];

  var url = 'api/v1/tile?level='+self.levelSelect+'&locX='+centerX+'&locY='+centerY+'&w='+3*Global.screenCellsWidth +'&h='+3*Global.screenCellsHeight;
 Levels.getMapTiles(url).then(function(resp){
                mapBuilds = [];  ///Clear anything that has been updated.
                map.tiles = [];
                map.tiles = resp;
                loadingGif.hide();
                 console.log(resp);
                 
                 drawWorld();

 },function(err){
                console.log('GET MAP ERROR');
                console.log(err);
                loadingGif.hide();
 });

}


function getAdvs(){
 loadingGif.show();
  advs = [];

  var url = 'api/v1/adv?level='+self.levelSelect;
 Levels.getAdvs(url).then(function(resp){
              console.log('Get adVs');
              console.log(resp);
        advs = resp;
	
	

        loadingGif.hide();
        drawWorld();
                

 },function(err){
        console.log('GET advs ERROR');
        console.log(err);
        loadingGif.hide();
 });


}


$("#colorPicker").spectrum({
    showAlpha: true,
    change: function(tinycolor) { 
      console.log(tinycolor);
      console.log(tinycolor.r);
      console.log(tinycolor._r);
      console.log(self.color_r_selected);
      self.color_r_selected = tinycolor._r;
       self.color_g_selected = tinycolor._g;
         self.color_b_selected = tinycolor._b;
           self.color_a_selected = tinycolor._a;
           console.log(self.color_r_selected);
    }
});


$("#colorPicker").spectrum("set", 'rgba(255,0,0,0.2)');

  self.color_r_selected = 255;
  self.color_g_selected = 0;
  self.color_b_selected = 0;
  self.color_a_selected = 0.2;


self.addLevel = function(){

          loadingGif.show();
          var levelObj = {
            "mapname": levelName.value
          };

          var addLevelXhrCallConfig = {
                method : 'POST',
                url: 'api/v1/map',
                data: levelObj,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(addLevelXhrCallConfig).then(function(resp){
                self.levelSelect = resp.data.id.toString();

                getLevels();
         
                  self.levelChange();

                loadingGif.hide();
           }, function(err){
                    console.log('SAVING ERR');
                       console.log(err);
                      loadingGif.hide();
           });



};

self.editLevelname = function(){

      loadingGif.show();
          var levelObj = {
            "mapname": levelName.value
          };
         
          var editLevelXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: levelObj,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(editLevelXhrCallConfig).then(function(resp){
      
                getLevels();

                loadingGif.hide();
           }, function(err){
                    console.log('SAVING ERR');
                       console.log(err);
                      loadingGif.hide();
           });


};

self.openLevelSelectModal = function(){
self.thereIsAModalOpen = true;
$('#levelSelectModalBuild').modal({backdrop: 'static', keyboard: false});
$('#levelSelectModalBuild').modal('show');
};

self.levelChange = function(){
console.log("CHANGE LEVEL");
self.levelSelect = $('#buildlevelSelect').val();
console.log(self.levelSelect);
self.thereIsAModalOpen = false;
$('#levelSelectModalBuild').modal('hide');
getLevels();
//getMapTiles();
//getAdvs();

};


self.goOpenSource = function(){
var openSourceData = {userId: 0};
console.log('self.levelSelect');
console.log(self.levelSelect);
 var openSourceLevelXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: openSourceData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(openSourceLevelXhrCallConfig).then(function(resp){
            
              self.isCrowdSourced = true;

                loadingGif.hide();
           }, function(err){
         
                    console.log('OpenSource ERR');
                       console.log(err);
               self.isCrowdSourced = false;
                      loadingGif.hide();
           });
};


self.deleteLevelForSure = function(){
 self.thereIsAModalOpen = false;
  $('#deleteMapWarningModal').modal('hide');  
  var deleteLevelXhrCallConfig = {
                method : 'DELETE',
                url: 'api/v1/map/'+self.levelSelect,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(deleteLevelXhrCallConfig).then(function(resp){
              self.thereIsAModalOpen = false;
              $('#deleteMapWarningModal').modal('hide');  
            self.levelSelect = '1';
                getLevels();

                loadingGif.hide();
           }, function(err){
             self.thereIsAModalOpen = false;
             $('#deleteMapWarningModal').modal('hide');  
                    console.log('SAVING ERR');
                       console.log(err);
                      loadingGif.hide();
           });


};


self.deleteLevel = function(){

   loadingGif.show();
    self.thereIsAModalOpen = true;
      $('#deleteMapWarningModal').modal({backdrop: 'static', keyboard: false});
    $('#deleteMapWarningModal').modal('show');        
    
};

self.addAdvModal = function(){
	if(selectCells.length === 1){
   loadingGif.show();
     self.thereIsAModalOpen = true;
    $('#addAdvModal').modal({backdrop: 'static', keyboard: false});
    $('#addAdvModal').modal('show');  
	}

};
self.advWidth = '2';
self.advHeight = '2';
self.submitAdvAllocation = function(){
self.thereIsAModalOpen = false;
$('#addAdvModal').modal('hide'); 
   console.log(selectCells);

   console.log(self.advWidth);
   console.log(self.advHeight);
 

  var adVData = {locX: selectCells[0].locX, locY: selectCells[0].locY, width: parseInt(self.advWidth), height: parseInt(self.advHeight), mapId:self.levelSelect};

 var newAdvDataXhrCallConfig = {
                method : 'POST',
                url: 'api/v1/adv',
                data: adVData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(newAdvDataXhrCallConfig).then(function(resp){
             
            console.log('Add new Adv resp');
            console.log(resp);
		self.thereIsAModalOpen = false;
            $('#addAdvModal').modal('hide');  
              self.setTilesAsAdvTiles(selectCells[0].locX, selectCells[0].locY, parseInt(self.advWidth), parseInt(self.advHeight));
             
                loadingGif.hide();
           }, function(err){
         
                    console.log('Intro Text ERR');
                       console.log(err);
              
                      loadingGif.hide();
			 self.thereIsAModalOpen = false;
                      $('#addAdvModal').modal('hide');
           });



};


self.closeDialog = function(){
 self.thereIsAModalOpen = false;
  loadingGif.hide();
};




self.setIntroModal = function(){
   loadingGif.show();
 self.thereIsAModalOpen = true;
   $('#addMapIntroModal').modal({backdrop: 'static', keyboard: false});
  $('#addMapIntroModal').modal('show');  

};

self.submitMapIntro = function(){
console.log('map intro text');
console.log(self.mapIntroTextarea);
 loadingGif.show();
 // mapIntro
 //  startSquare
 
 //  endSquare
  var introTextData = {mapIntro: self.mapIntroTextarea};

 var introTextXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: introTextData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(introTextXhrCallConfig).then(function(resp){
             self.thereIsAModalOpen = false;
             $('#addMapIntroModal').modal('hide'); 
                loadingGif.hide();
           }, function(err){
         
                    console.log('Intro Text ERR');
                       console.log(err);
              
                      loadingGif.hide();
           });

};


self.addstartCell = function(x, y){
   loadingGif.show();
 self.thereIsAModalOpen = true;
 $('#setStartSquareModal').modal({backdrop: 'static', keyboard: false});
  $('#setStartSquareModal').modal('show'); 

  var addstartCellData = {startXtile: x, startYtile: y};

 var startCellXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: addstartCellData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(startCellXhrCallConfig).then(function(resp){

              map.start = [resp.data.startXtile, resp.data.startYtile];
          
              drawWorld();

                loadingGif.hide();
           }, function(err){
         
                    console.log('Update Start ERR');
                       console.log(err);
              
                      loadingGif.hide();
           });


};

self.submitstartSquareText = function(){
console.log('start txt');
console.log(self.startSquareTextarea);
 loadingGif.show();

  var startSquareData = {startSquare: self.startSquareTextarea};

 var startSquareTextXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: startSquareData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(startSquareTextXhrCallConfig).then(function(resp){
             self.thereIsAModalOpen = false;
            $('#setStartSquareModal').modal('hide'); 
                loadingGif.hide();
           }, function(err){
         
                    console.log('Intro Text ERR');
                       console.log(err);
              
                      loadingGif.hide();
           });

};


self.addfinishCell = function(x, y){
   loadingGif.show();

 self.thereIsAModalOpen = true;
 $('#setFinishSquareModal').modal({backdrop: 'static', keyboard: false});
 $('#setFinishSquareModal').modal('show'); 

  var addfinishCellData = {finishXtile: x, finishYtile: y};

 var finishCellXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: addfinishCellData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(finishCellXhrCallConfig).then(function(resp){


              map.finish = [resp.data.finishXtile, resp.data.finishYtile];
          
              drawWorld();

                loadingGif.hide();
           }, function(err){
         
                    console.log('Update Finish ERR');
                       console.log(err);
              
                      loadingGif.hide();
           });

};

self.submitfinishSquareText = function(){
console.log('Finish txt');
console.log(self.finishSquareTextarea);
 loadingGif.show();
 // mapIntro
 //  startSquare
 
 //  endSquare
  var endSquareData = {endSquare: self.finishSquareTextarea};

 var endSquareTextXhrCallConfig = {
                method : 'PUT',
                url: 'api/v1/map/'+self.levelSelect,
                data: endSquareData,
                headers: {auth: User.token},
                responseType: "json"
            };

           $http(endSquareTextXhrCallConfig).then(function(resp){
              self.thereIsAModalOpen = false;
              $('#setFinishSquareModal').modal('hide'); 
                loadingGif.hide();
           }, function(err){
         
                    console.log('Intro Text ERR');
                       console.log(err);
              
                      loadingGif.hide();
           });


};



self.pageUp = function(){
  self.page = self.page + 1;
  getLevels();
};

self.pageDwn = function(){
  self.page = self.page - 1;
  if(self.page<0){
    self.page = 0;
  }
  getLevels();
};

self.page = 0;

self.orderByChange = function(){
  self.page = 0;
  getLevels();
};

self.orderByPulse = false;



function getLevels(){

  loadingGif.show();

 var url = 'api/v1/mapedits';

 
 if(self.orderByPulse){
 url += '?page='+self.page+'&orderBy=1';
 }else{

  url += '?page='+self.page;
 }

 Levels.getLevels(url).then(function(resp){
 
 self.levels = resp;  
 
console.log('Get Levels Resp');
console.log(resp);
console.log(self.levelSelect);

                var levelFound = false;

		var levelArrLength = self.levels.length;
		for(var i=0; i<levelArrLength; i++){
			 if(self.levelSelect ===  self.levels[i].id.toString()){
                        self.levelSelectName = self.levels[i].mapname;
                        levelFound = true;
                        console.log(self.levels[i]);
                         map.start = [self.levels[i].startXtile, self.levels[i].startYtile];
                          map.finish = [self.levels[i].finishXtile, self.levels[i].finishYtile];
				self.mapIntroTextarea = self.levels[i].mapIntro;
				self.startSquareTextarea = self.levels[i].startSquare;
			       self.finishSquareTextarea = self.levels[i].endSquare;

                          if(self.levels[i].userId === 0){
                           self.isCrowdSourced = true;
                          }else{
                            self.isCrowdSourced = false;
                          }
			 	break;
                     }


               }

                            
                if(!levelFound){
			
                 self.levelSelect = self.levels[0].id.toString();
                  if(self.levels[0].userId === 0){
                    self.isCrowdSourced = true;
                  }else{
                     self.isCrowdSourced = false;
                  }
                   map.start = [];
                   map.finish = [];
		     self.mapIntroTextarea = '';
		     self.startSquareTextarea = '';
		      self.finishSquareTextarea = '';
                  }
			
                    
		    setMatrix();
                  getMapTiles();
                  getAdvs();
                  
                  drawWorld();
                  
                  loadingGif.hide();
             
		
 },function(err){

console.log('GET LEVELS ERROR');
                console.log(err);
                      loadingGif.hide();
 });


 


}



if(!User.loggedin){
  loadingGif.show();
   User.isTokenValid().then(function(user){
      console.log("USER NOT LOGGED IN IS TOKEN VALID RESP");
      console.log(user);
      console.log(User);
      getLevels();
   },function(err){
      console.log("USER NOT LOGGED IN IS TOKEN VALID ERR");
      console.log(err);
      $state.go('login');
   });

}else{
   getLevels();
  console.log('USER IS LOGGEDIN');
  console.log(User);
}




self.logout = function() {
 
    User.logout(User.token);
    $state.go('login');

};

$('#playXonumiaBtn').click(function() {
 
    $state.go('play');

});



}]);


}; 