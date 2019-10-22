require('angular');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Draw', 
	['Global', 'Matrix', '$state', function(Global, Matrix, $state){
    //console.log("XonumiaController");


var tempCanvas;	

function valueInRange(min, max, value) {
    return Math.min(max, Math.max(min, value));
}



var service = this;

service.drawOnInvisibleCanvas = function(map){

Global.canvasCache = document.createElement('canvas');
Global.canvasCache.setAttribute("width", "1500");
Global.canvasCache.setAttribute("height", "1500");
Global.canvasCache.setAttribute("id", "mapCanvas");
Global.canvasCache.style.cssText = 'display:none;background:rgb(192,192,192);';
Global.canvasctx = Global.canvasCache.getContext("2d");
service.drawMaptoInvisibleCanvas(map);

};


service.createMapImage = function(ctx, map){

if(Global.needNewGlobalMap){
service.drawOnInvisibleCanvas(map);
}

Global.mapImage = new Image();

Global.mapImage.src = Global.canvasCache.toDataURL();
Global.needNewGlobalMap = false;
};


service.checkifnewMapImageNeeded = function(){
  var boolcheck = (Global.player.x - Global.mapimageinizializationlocation[0]) < Global.screenCellsWidth ||
			 ((Global.mapimageinizializationlocation[0]+3*Global.screenCellsWidth) - Global.player.x) < Global.screenCellsWidth ||
            (Global.mapimageinizializationlocation[1] - Global.player.y) < Global.screenCellsHeight ||
			 (Global.player.y - (Global.mapimageinizializationlocation[1]-3*Global.screenCellsHeight)) < Global.screenCellsHeight;

 if(boolcheck){
   Global.needNewGlobalMap = true;
 }else{
  Global.needNewGlobalMap = false;
 }

};

service.drawMapImage = function(ctx){

 var topleftMapImage =  Matrix.map([(Global.mapimageinizializationlocation[0]), (Global.mapimageinizializationlocation[1]), 1]);

ctx.drawImage(Global.mapImage, topleftMapImage[0],topleftMapImage[1]);

//service.checkifnewMapImageNeeded();


};


service.drawMap = function(ctx, map){

    ctx.beginPath();
    ctx.setLineDash([1,0]);
    ctx.strokeStyle = '#000000';
       ctx.lineWidth = 5;
       ctx.lineCap = "round";

  map.tiles.forEach(function(tile){
   var start = [];
   var end = [];

    if(tile.gu){
       start =  Matrix.map([(tile.locX-0.5), (tile.locY+0.5), 1]);
       end =  Matrix.map([(tile.locX+0.5), (tile.locY+0.5), 1]);
       ctx.moveTo(start[0], start[1]);
       ctx.lineTo(end[0], end[1]);
     }
       if(tile.gr){
       start =  Matrix.map([(tile.locX+0.5), (tile.locY+0.5), 1]);
       end =  Matrix.map([(tile.locX+0.5), (tile.locY-0.5), 1]);
       ctx.moveTo(start[0], start[1]);
       ctx.lineTo(end[0], end[1]);
    }

   if(tile.gd){
        start =  Matrix.map([(tile.locX-0.5), (tile.locY-0.5), 1]);
        end =  Matrix.map([(tile.locX+0.5), (tile.locY-0.5), 1]);
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
    }

 if(tile.gl){
        start =  Matrix.map([(tile.locX-0.5), (tile.locY-0.5), 1]);
        end =  Matrix.map([(tile.locX-0.5), (tile.locY+0.5), 1]);
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
   }

   
  ctx.fillStyle = 'rgba('+Math.floor(tile.color_r)+', '+Math.floor(tile.color_g)+', '+Math.floor(tile.color_b)+', '+tile.color_a+')';
   
  var topleftR =  Matrix.map([(tile.locX-0.505), (tile.locY+0.505), 1]);
  var bottomR =  Matrix.map([(tile.locX+0.505), (tile.locY-0.505), 1]);
  var widthR = bottomR[0] - topleftR[0];
  var heightR = bottomR[1] - topleftR[1];
  ctx.fillRect((topleftR[0]), (topleftR[1]), widthR, heightR);
 
 });


 ctx.stroke();
 ctx.closePath();

};


service.drawMaptoInvisibleCanvas = function(map){

 var initPosImage = [Global.screenWidth/2 - 1.5*Global.screenWidth, Global.screenHeight/2 - 1.5*Global.screenHeight, 1];
 var mapImageGamePos = Matrix.inverseMap(initPosImage);
 Global.mapimageinizializationlocation = [mapImageGamePos[0], mapImageGamePos[1]];


  Global.canvasctx.beginPath();
   Global.canvasctx.setLineDash([1,0]);
   Global.canvasctx.strokeStyle = '#000000';
      Global.canvasctx.lineWidth = 5;
      Global.canvasctx.lineCap = "round";

 map.tiles.forEach(function(tile){
  var start = [];
  var end = [];

  if(tile.gu){
       start =  Matrix.map([(tile.locX-0.5), (tile.locY+0.5), 1]);
       end =  Matrix.map([(tile.locX+0.5), (tile.locY+0.5), 1]);
   Global.canvasctx.moveTo(start[0] + Global.screenWidth, start[1]+Global.screenHeight);
    Global.canvasctx.lineTo(end[0] + Global.screenWidth, end[1]+Global.screenHeight);
    }
      if(tile.gr){
       start =  Matrix.map([(tile.locX+0.5), (tile.locY+0.5), 1]);
       end =  Matrix.map([(tile.locX+0.5), (tile.locY-0.5), 1]);
   Global.canvasctx.moveTo(start[0]+ Global.screenWidth, start[1]+Global.screenHeight);
   Global.canvasctx.lineTo(end[0]+ Global.screenWidth, end[1]+Global.screenHeight);
    }

   if(tile.gd){
        start =  Matrix.map([(tile.locX-0.5), (tile.locY-0.5), 1]);
         end =  Matrix.map([(tile.locX+0.5), (tile.locY-0.5), 1]);
   Global.canvasctx.moveTo(start[0]+ Global.screenWidth, start[1]+Global.screenHeight);
   Global.canvasctx.lineTo(end[0]+ Global.screenWidth, end[1]+Global.screenHeight);
    }

 if(tile.gl){
        start =  Matrix.map([(tile.locX-0.5), (tile.locY-0.5), 1]);
         end =  Matrix.map([(tile.locX-0.5), (tile.locY+0.5), 1]);
    Global.canvasctx.moveTo(start[0]+ Global.screenWidth, start[1]+Global.screenHeight);
    Global.canvasctx.lineTo(end[0]+ Global.screenWidth, end[1]+Global.screenHeight);
    }

   
   Global.canvasctx.fillStyle = 'rgba('+Math.floor(tile.color_r)+', '+Math.floor(tile.color_g)+', '+Math.floor(tile.color_b)+', '+tile.color_a+')';
   
  var topleftR =  Matrix.map([(tile.locX-0.505), (tile.locY+0.505), 1]);
  var bottomR =  Matrix.map([(tile.locX+0.505), (tile.locY-0.505), 1]);
  var widthR = bottomR[0] - topleftR[0];
  var heightR = bottomR[1] - topleftR[1];
 Global.canvasctx.fillRect((topleftR[0])+ Global.screenWidth, (topleftR[1])+Global.screenHeight, widthR, heightR);
 
 });


 Global.canvasctx.stroke();
 Global.canvasctx.closePath();

};





service.drawSelectedCells = function(ctx, selectCells){
  ctx.beginPath();
 var numSelectedCells = selectCells.length;
 for(var i= 0; i<numSelectedCells; i++){

    ctx.setLineDash([1,0]);
    ctx.fillStyle = '#cecece';
    ctx.lineWidth = 3;
    ctx.strokeStyle= '#333';

    var topleftR =  Matrix.map([(selectCells[i].locX-0.25), (selectCells[i].locY+0.25), 1]);
    var bottomR =  Matrix.map([(selectCells[i].locX+0.25), (selectCells[i].locY-0.25), 1]);
    var widthR = bottomR[0] - topleftR[0];
    var heightR = bottomR[1] - topleftR[1];
    ctx.rect((topleftR[0]), (topleftR[1]), widthR, heightR);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
 }

};



service.drawHoverCell = function(ctx, hoverCell){

  ctx.beginPath();
  ctx.setLineDash([1,0]);
  ctx.strokeStyle = '#ffa366';
  ctx.lineWidth = 3;

  var topleftR =  Matrix.map([(hoverCell[0]-0.4), (hoverCell[1]+0.4), 1]);
  var bottomR =  Matrix.map([(hoverCell[0]+0.4), (hoverCell[1]-0.4), 1]);

  var widthR = bottomR[0] - topleftR[0];
  var heightR = bottomR[1] - topleftR[1];

  ctx.strokeRect((topleftR[0]), (topleftR[1]), widthR, heightR);
  ctx.closePath();

}; 



service.drawGrid = function(ctx, zoom){

   var bottomleftEdgeCoord = [0, Global.screenHeight, 1];

   var toprightEdgeCoord = [Global.screenWidth, 0, 1];


   var localCoordBottomLeftView = Matrix.inverseMap(bottomleftEdgeCoord);

   var localCoordTopRightView = Matrix.inverseMap(toprightEdgeCoord);


   ctx.beginPath();
   ctx.setLineDash([3,6]);
   ctx.strokeStyle = '#ccc';
   var istart =  Math.floor(localCoordBottomLeftView[0]);
   var iend = Math.floor(localCoordTopRightView[0]) + 1;

  for (var i=istart; i<iend; i++){

    var start = [i, localCoordBottomLeftView[1], 1];
    var end = [i, localCoordTopRightView[1], 1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
    ctx.lineWidth = (zoom/100);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();

    }

   var jstart =  Math.floor(localCoordBottomLeftView[1]);
   var jend = Math.floor(localCoordTopRightView[1]) +1;
  for (var j=jstart; j<jend; j++){

    start = [localCoordBottomLeftView[0], j, 1];
    end = [localCoordTopRightView[0], j,  1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
    ctx.lineWidth = (zoom/100);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();

    }
    ctx.closePath();


};

service.drawBounds = function(ctx, bounds) {
   
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.setLineDash([1,0]);
    ctx.lineWidth = 1;

    var start = [bounds[1], bounds[0], 1];
    var end = [bounds[1], bounds[2], 1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
  
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();


    start = [bounds[1], bounds[2], 1];
    end = [bounds[3], bounds[2], 1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
   
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();

    start = [bounds[3], bounds[2], 1];
    end = [bounds[3], bounds[0], 1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
  
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();


    start = [bounds[3], bounds[0], 1];
    end = [bounds[1], bounds[0], 1];

    start = Matrix.map(start);
    end = Matrix.map(end);

    ctx.moveTo(start[0], start[1]);
  
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();


    ctx.closePath();

};

service.drawWorldCoordinateSystem = function(ctx, zoom){


  var bottomleftEdgeCoord = [0, Global.screenHeight, 1];

  var toprightEdgeCoord = [Global.screenWidth, 0, 1];

  var localCoordBottomLeftView = Matrix.inverseMap(bottomleftEdgeCoord);

  var localCoordTopRightView = Matrix.inverseMap(toprightEdgeCoord);

   
  ctx.beginPath();
 
    
   ctx.strokeStyle = '#ccc';
   ctx.setLineDash([1,0]);
   var start = [0, localCoordBottomLeftView[1], 1];
   var end = [0, localCoordTopRightView[1], 1];

   start = Matrix.map(start);
   end = Matrix.map(end);

   ctx.moveTo(start[0], start[1]);
   ctx.lineWidth = (zoom/50);
   ctx.lineTo(end[0], end[1]);
   ctx.stroke();



   var start = [localCoordBottomLeftView[0], 0, 1];
   var end = [localCoordTopRightView[0],0, 1];

   start = Matrix.map(start);
   end = Matrix.map(end);

   ctx.moveTo(start[0], start[1]);
   ctx.lineWidth = (zoom/50);
   ctx.lineTo(end[0], end[1]);
   ctx.stroke();

   ctx.closePath();

};

service.drawStartCell = function(ctx, start){
   ctx.beginPath();
  // ctx.setLineDash([1,0]);
  // ctx.strokeStyle = '#FF0000';
  // ctx.lineWidth = 6;

   var topleftR =  Matrix.map([(start[0]-0.45), (start[1]+0.45), 1]);
   var bottomR =  Matrix.map([(start[0]+0.45), (start[1]-0.45), 1]);

  
   var widthR = bottomR[0] - topleftR[0];
   var heightR = bottomR[1] - topleftR[1];
	var cenX = topleftR[0] + widthR/2;
	var cenY = topleftR[1] + heightR/2
    var grd = ctx.createRadialGradient(cenX, cenY, 2, cenX, cenY, widthR/2);
     grd.addColorStop(0, '#FF0000');
     grd.addColorStop(1, '#004CB3');

     ctx.fillStyle = grd;
     ctx.fillRect((topleftR[0]), (topleftR[1]), widthR, heightR);

  // ctx.strokeRect((topleftR[0]), (topleftR[1]), widthR, heightR);
   ctx.closePath();

};

service.drawFinishCell = function(ctx, finish){
    ctx.beginPath();
    //ctx.setLineDash([1,0]);
    //ctx.strokeStyle = '#00FF00';
   // ctx.lineWidth = 6;

    var topleftR =  Matrix.map([(finish[0]-0.45), (finish[1]+0.45), 1]);
    var bottomR =  Matrix.map([(finish[0]+0.45), (finish[1]-0.45), 1]);

    var widthR = bottomR[0] - topleftR[0];
    var heightR = bottomR[1] - topleftR[1];

var cenX = topleftR[0] + widthR/2;
	var cenY = topleftR[1] + heightR/2
    var grd = ctx.createRadialGradient(cenX, cenY, 2, cenX, cenY, widthR/2);
      grd.addColorStop(0, '#00FF00');
     grd.addColorStop(1, '#004CB3');

     ctx.fillStyle = grd;
     ctx.fillRect((topleftR[0]), (topleftR[1]), widthR, heightR);

    //ctx.strokeRect((topleftR[0]), (topleftR[1]), widthR, heightR);
    ctx.closePath();
};

service.drawOtherPlayers = function(ctx, order, player, playerConfig) {

    var start = {
        x: player.x,
        y: player.y
    };


    for(var z=0; z<order.length; z++) {
    
              var userCurrent = order[z];
        
           
              var x=0;
              var y=0;

              ctx.strokeStyle = 'rgba(' + userCurrent.playerConfig.borderColorR + 
					','+ userCurrent.playerConfig.borderColorG +
					','+ userCurrent.playerConfig.borderColorB +
					','+ userCurrent.playerConfig.borderColorA + ')';
              ctx.fillStyle = 'rgba(' + userCurrent.playerConfig.bodyColorR + 
					','+ userCurrent.playerConfig.bodyColorG +
					','+ userCurrent.playerConfig.bodyColorB +
					','+ userCurrent.playerConfig.bodyColorA + ')';
              ctx.lineWidth = userCurrent.playerConfig.border;

              var xstore = [];
              var ystore = [];

              Global.spin += 0.0;
            

         var points = 10 + ~~((userCurrent.radius)/5);
              var increase = Math.PI * 2 / points;
         
                          
              for (var i = 0; i < points; i++) {

                  x = userCurrent.radius * Math.cos(Global.spin) + userCurrent.x;
                  y = userCurrent.radius * Math.sin(Global.spin) + userCurrent.y;
                
                  Global.spin += increase;
                  xstore[i] = x;
                  ystore[i] = y;
              }


              var test = Matrix.map([10, 10, 1]);

        
              
              for (i = 0; i < points; ++i) {
                  if (i === 0) {
                      ctx.beginPath();
                      var moveTo = Matrix.map([xstore[i], ystore[i], 1]);
                   

                      ctx.moveTo(moveTo[0], moveTo[1]);
                  

                  } else if (i > 0 && i < points - 1) {
                    var lineTo = Matrix.map([xstore[i], ystore[i], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
   

                  } else {
                     lineTo = Matrix.map([xstore[i], ystore[i], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
                  
                      lineTo = Matrix.map([xstore[0], ystore[0], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
           
                  }
              }

              ctx.lineJoin = 'round';
              ctx.lineCap = 'round';
              ctx.fill();
              ctx.stroke();
              var nameCell = "";
              if(typeof(userCurrent.id) == "undefined"){
                  nameCell = player.name;
              }else{
                  nameCell = userCurrent.name;
              }
       
              var fontSize = 13;
              ctx.lineWidth =  userCurrent.playerConfig.textBorderSize;
              ctx.fillStyle =  userCurrent.playerConfig.textColor;
              ctx.strokeStyle =  userCurrent.playerConfig.textBorder;
              ctx.miterLimit = 1;
              ctx.lineJoin = 'round';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold ' + fontSize + 'px sans-serif';

                   var txtLocation = Matrix.map([userCurrent.x, userCurrent.y, 1]);
                  ctx.strokeText(nameCell, txtLocation[0], txtLocation[1]);
                  ctx.fillText(nameCell, txtLocation[0], txtLocation[1]);
                  ctx.font = 'bold ' + Math.max(fontSize / 3 * 2, 10) + 'px sans-serif';

                  if(typeof(nameCell) === "undefined") fontSize = 0;

                  ctx.strokeText(Math.floor(userCurrent.x) + ', ' + Math.floor(userCurrent.y), txtLocation[0], txtLocation[1]+fontSize);
                  ctx.fillText(Math.floor(userCurrent.x) + ', ' + Math.floor(userCurrent.y), txtLocation[0], txtLocation[1]+fontSize);
              
    }
};

service.drawPlayer = function(ctx, player, displayName, displayXnums) {

    var start = {
        x: player.x,
        y: player.y
    };
       
              var x=0;
              var y=0;
	
              ctx.strokeStyle = 'rgba(' + player.playerConfig.borderColorR + 
					','+ player.playerConfig.borderColorG +
					','+ player.playerConfig.borderColorB +
					','+ player.playerConfig.borderColorA + ')';

              ctx.fillStyle = 'rgba(' + player.playerConfig.bodyColorR + 
					','+ player.playerConfig.bodyColorG +
					','+ player.playerConfig.bodyColorB +
					','+ player.playerConfig.bodyColorA + ')';

              ctx.lineWidth = player.playerConfig.border;

              var xstore = [];
              var ystore = [];

              Global.spin += 0.0;
            

         var points = 10 + ~~((player.radius)/5);
              var increase = Math.PI * 2 / points;
         
             


             

              
              for (var i = 0; i < points; i++) {

                  x = player.radius * Math.cos(Global.spin) + player.x;
                  y = player.radius * Math.sin(Global.spin) + player.y;
                
                  Global.spin += increase;
                  xstore[i] = x;
                  ystore[i] = y;
              }


              for (i = 0; i < points; ++i) {
                  if (i === 0) {
                      ctx.beginPath();
                      var moveTo = Matrix.map([xstore[i], ystore[i], 1]);
                   

                      ctx.moveTo(moveTo[0], moveTo[1]);
                  

                  } else if (i > 0 && i < points - 1) {
                    var lineTo = Matrix.map([xstore[i], ystore[i], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
   

                  } else {
                     lineTo = Matrix.map([xstore[i], ystore[i], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
                  
                      lineTo = Matrix.map([xstore[0], ystore[0], 1]);
                      ctx.lineTo(lineTo[0], lineTo[1]);
           
                  }
              }

              ctx.lineJoin = 'round';
              ctx.lineCap = 'round';
              ctx.fill();
              ctx.stroke();

	if(displayName){
              var nameCell = "";
              if(typeof(player.id) == "undefined"){
                  nameCell = player.name;
              }else{
                  nameCell = player.name;
              }
       
              var fontSize = 13;
              ctx.lineWidth = player.playerConfig.textBorderSize;
              ctx.fillStyle = player.playerConfig.textColor;
              ctx.strokeStyle = player.playerConfig.textBorder;
              ctx.miterLimit = 1;
              ctx.lineJoin = 'round';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold ' + fontSize + 'px sans-serif';

                  var txtLocation = Matrix.map([player.x, player.y, 1]);
                  ctx.strokeText(nameCell, txtLocation[0], txtLocation[1]);
                  ctx.fillText(nameCell, txtLocation[0], txtLocation[1]);
                 // ctx.font = 'bold ' + Math.max(fontSize / 3 * 2, 10) + 'px sans-serif';

                  

                 // ctx.strokeText(Math.floor(player.x) + ', ' + Math.floor(player.y), txtLocation[0], txtLocation[1]+fontSize);
                 // ctx.fillText(Math.floor(player.x) + ', ' + Math.floor(player.y), txtLocation[0], txtLocation[1]+fontSize);
	  }else if(displayXnums){
              var fontSize = 13;
              ctx.lineWidth = player.playerConfig.textBorderSize;
              ctx.fillStyle = player.playerConfig.textColor;
              ctx.strokeStyle = player.playerConfig.textBorder;
              ctx.miterLimit = 1;
              ctx.lineJoin = 'round';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold ' + fontSize + 'px sans-serif';

                  var txtLocation = Matrix.map([player.x, player.y, 1]);
                  ctx.strokeText('xNum: ' + player.xnumsLength, txtLocation[0], txtLocation[1]);
                  ctx.fillText('xNum: ' + player.xnumsLength, txtLocation[0], txtLocation[1]);
                
                  ctx.strokeText('xVal ($): ' + player.xnumsVal, txtLocation[0], txtLocation[1]+fontSize);
                  ctx.fillText('xVal ($): ' + player.xnumsVal, txtLocation[0], txtLocation[1]+fontSize);
			
		    ctx.strokeText('xBits: ' + player.xbits, txtLocation[0], txtLocation[1]-fontSize);
                  ctx.fillText('xBits: ' + player.xbits, txtLocation[0], txtLocation[1]-fontSize);


	  }

      if(!displayXnums){
		   var fontSize = 13;
              ctx.lineWidth = player.playerConfig.textBorderSize;
              ctx.fillStyle = player.playerConfig.textColor;
              ctx.strokeStyle = player.playerConfig.textBorder;
              ctx.miterLimit = 1;
              ctx.lineJoin = 'round';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold ' + fontSize + 'px sans-serif';

              var txtLocation = Matrix.map([player.x + Math.floor(Global.screenCellsWidth/2)-1, player.y+2, 1]);
              ctx.strokeText('xNum: ' + player.xnumsLength, txtLocation[0], txtLocation[1]);
              ctx.fillText('xNum: ' + player.xnumsLength, txtLocation[0], txtLocation[1]);
                
              ctx.strokeText('xVal ($): ' + player.xnumsVal, txtLocation[0], txtLocation[1]+fontSize);
              ctx.fillText('xVal ($): ' + player.xnumsVal, txtLocation[0], txtLocation[1]+fontSize);
			
		ctx.strokeText('xBits: ' + player.xbits, txtLocation[0], txtLocation[1]-fontSize);
              ctx.fillText('xBits: ' + player.xbits, txtLocation[0], txtLocation[1]-fontSize);




      }
    
};



function drawCircle(graph, centerX, centerY, radius, sides) {
    var theta = 0;
    var x = 0;
    var y = 0;
    var xpoints = [[]];

    graph.beginPath();

    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
          var moveTo = Matrix.map([x, y, 1]);
                  
          graph.lineTo(moveTo[0], moveTo[1]);
          if(i === 1){
            xpoints[0] = [moveTo[0], moveTo[1]];
          } 
          if(i === 4){
            xpoints[1] = [moveTo[0], moveTo[1]];
          } 
          if(i === 5){
            xpoints[2] = [moveTo[0], moveTo[1]];
          } 
          if(i === 2){
            xpoints[3] = [moveTo[0], moveTo[1]];
          } 
    }
      
     graph.closePath(); 
	graph.fill();
     graph.stroke();
   

    return xpoints;
}



service.drawAdvs = function(ctx, advs, zoom, tmpCtx){
 var img;
 var start;
 var end;
  advs.forEach(function(instance){
    if(instance.htmlImg === null || instance.htmlImg === undefined){
	var htmlIMG = new Image;
         var  widthHeights = [instance.width, instance.height, 1];
      	  var whs = Matrix.map(widthHeights);
	  instance.w = whs[0];
	  instance.h = whs[1];

	if($state.current.name === 'build'){
       htmlIMG.src = 'public/advImages/' +instance.id+ '/'+ instance.imgS;
       }else{
		if(instance.width > 5){
  		htmlIMG.src = 'public/advImages/' +instance.id+ '/'+ instance.imgL;
		}else{
		htmlIMG.src = 'public/advImages/' +instance.id+ '/'+ instance.imgM;
		}
       }
	instance.htmlImg = htmlIMG;
       instance.adRatio = (instance.width/instance.height);
       instance.htmlImg.onload = function(){
           instance.naturalImageRatio = instance.htmlImg.naturalWidth/instance.htmlImg.naturalHeight;
         };
    }
    if(instance.img === 'sponsorshipavailable.png' && !instance.sponsorshipInterest){
     
     start = [instance.locX-0.55, instance.locY+0.55, 1];
     end = [start[0] + instance.width + 0.05, start[1] - instance.height - 0.05, 1];


     start = Matrix.map(start);
     end = Matrix.map(end);

     var cirx = (end[0] - start[0]) / 2 + start[0];

     var ciry = (end[1] - start[1]) / 2 + start[1];

     //var r1 = Math.min((end[0] - start[0]), (end[1] - start[1]));
      var r2 = Math.max((end[0] - start[0]), (end[1] - start[1]));
   
     var grd = ctx.createRadialGradient(cirx, ciry, 2, cirx, ciry, r2/2);
     grd.addColorStop(0, '#8ED6FF');
     grd.addColorStop(1, '#004CB3');

     ctx.fillStyle = grd;
     ctx.fillRect(start[0], start[1], end[0]-start[0], end[1]-start[1]);
     img = document.getElementById('advImgAvailable');
   
      var cenx = (end[0] - start[0]) / 2 + start[0];

     var ceny = (end[1] - start[1]) / 2 + start[1];

      var r = Math.min((end[0] - start[0]), (end[1] - start[1]));

     ctx.drawImage(img, cenx-r/2, ceny-r/2, r, r);
     
    }else if(instance.sponsorshipInterest){
     start = [instance.locX-0.55, instance.locY+0.55, 1];
     end = [start[0] + instance.width + 0.05, start[1] - instance.height - 0.05, 1];


     start = Matrix.map(start);
     end = Matrix.map(end);

     var cirx = (end[0] - start[0]) / 2 + start[0];

     var ciry = (end[1] - start[1]) / 2 + start[1];

     //var r1 = Math.min((end[0] - start[0]), (end[1] - start[1]));
      var r2 = Math.max((end[0] - start[0]), (end[1] - start[1]));
   
     var grd = ctx.createRadialGradient(cirx, ciry, 2, cirx, ciry, r2/2);
     grd.addColorStop(0, '#8ED6FF');
     grd.addColorStop(1, '#ffbf80');

     ctx.fillStyle = grd;
     ctx.fillRect(start[0], start[1], end[0]-start[0], end[1]-start[1]);
     img = document.getElementById('advImgInterest');
   
      var cenx = (end[0] - start[0]) / 2 + start[0];

     var ceny = (end[1] - start[1]) / 2 + start[1];

      var r = Math.min((end[0] - start[0]), (end[1] - start[1]));

     ctx.drawImage(img, cenx-r/2, ceny-r/2, r, r);


    }else{ 


	switch (instance.aspect){

 	case 0:  //Stretch
	       start = [instance.locX-0.45, instance.locY+0.45, 1];
    		 end = [start[0] + instance.width - 0.1, start[1] - instance.height + 0.1, 1];
     		start = Matrix.map(start);
    		 end = Matrix.map(end);
         ctx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));
	  break;
	case 1: //Fit
  	
	    if(instance.naturalImageRatio){
		if(instance.adRatio <=  instance.naturalImageRatio){ //Flat
		    var dy = (instance.height - instance.width/instance.naturalImageRatio)/2;
			
		    start = [instance.locX-0.45, instance.locY+0.45-dy, 1];
    		    end = [start[0] + instance.width - 0.1, (start[1] - instance.width/instance.naturalImageRatio + 0.1), 1];
     	           start = Matrix.map(start);
    	           end = Matrix.map(end);
			
     	           ctx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));

               }else{ // Tall
		    var dx = (instance.width - instance.height*instance.naturalImageRatio)/2;
					
		    start = [instance.locX-0.45+dx, instance.locY+0.45, 1];
    		    end = [(start[0] + instance.height*instance.naturalImageRatio - 0.1), start[1] - instance.height + 0.1, 1];
     	           start = Matrix.map(start);
    	           end = Matrix.map(end);
			
     		    ctx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));
               }

	    }

	 break;
	case 2:  //Fill
           if(instance.naturalImageRatio){

	     if(instance.adRatio <=  instance.naturalImageRatio){ //Flat
		 var dx = (instance.height*instance.naturalImageRatio - instance.width)/2;
		 
		    start = [instance.locX-0.45-dx, instance.locY+0.45, 1];
    		    end = [start[0] + instance.height*instance.naturalImageRatio + 0.1, start[1] - instance.height + 0.1, 1];
     	           start = Matrix.map(start);
    	           end = Matrix.map(end);
			
             	 tmpCtx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));
                   
		  start = [instance.locX-0.45, instance.locY+0.45, 1];
    		  end = [start[0] + instance.width - 0.1, start[1] - instance.height + 0.1, 1];
     		  start = Matrix.map(start);
    		  end = Matrix.map(end);

		    var imgData =  tmpCtx.getImageData(start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));
                  ctx.putImageData(imgData, start[0], start[1]);

            }else{  //Tall
		 var dy = (instance.width/instance.naturalImageRatio-instance.height)/2;
		
		    start = [instance.locX-0.45, instance.locY+0.45+dy, 1];
    		    end = [start[0] + instance.width + 0.1, start[1] - instance.width/instance.naturalImageRatio + 0.1, 1];
     	           start = Matrix.map(start);
    	           end = Matrix.map(end);
			
     		     tmpCtx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));

		   start = [instance.locX-0.45, instance.locY+0.45, 1];
    		  end = [start[0] + instance.width - 0.1, start[1] - instance.height + 0.1, 1];
     		  start = Matrix.map(start);
    		  end = Matrix.map(end);

		    var imgData =  tmpCtx.getImageData(start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));
                  ctx.putImageData(imgData, start[0], start[1]);
             }

            }
	 break;
       default:

        start = [instance.locX-0.55, instance.locY+0.55, 1];
        end = [start[0] + instance.width + 0.05, start[1] - instance.height - 0.05, 1];
        start = Matrix.map(start);
        end = Matrix.map(end);
        ctx.drawImage(instance.htmlImg, start[0], start[1], (end[0]-start[0]), (end[1]-start[1]));

      }

    
   }
  });
};


service.drawXnum = function(graph, xnum){

  xnum.forEach(function(instance){
    // graph.beginPath();
    graph.strokeStyle = 'rgba(255,0,0,1.0)';
    graph.fillStyle = 'rgba(0,0,0,1.0)';
    graph.lineWidth = 3;
     graph.lineJoin = 'round';
     graph.lineCap = 'round';
  var xpoints =  drawCircle(graph, instance.locX, instance.locY, 0.4, 25);
  var xoPoints = [
			[instance.locX+0.17, instance.locY+0.17],
			[instance.locX-0.17, instance.locY-0.17],
			[instance.locX-0.17, instance.locY+0.17],
			[instance.locX+0.17, instance.locY-0.17]
		];

   var xoPointsMapped = [
			Matrix.map([xoPoints[0][0], xoPoints[0][1], 1]),
			Matrix.map([xoPoints[1][0], xoPoints[1][1], 1]),
			Matrix.map([xoPoints[2][0], xoPoints[2][1], 1]),
			Matrix.map([xoPoints[3][0], xoPoints[3][1], 1])
		];


  graph.beginPath();
  graph.lineWidth = 12;
  graph.moveTo(xoPointsMapped[0][0], xoPointsMapped[0][1]);
  graph.lineTo(xoPointsMapped[1][0], xoPointsMapped[1][1]);
  graph.moveTo(xoPointsMapped[2][0], xoPointsMapped[2][1]);
  graph.lineTo(xoPointsMapped[3][0], xoPointsMapped[3][1]);
  graph.stroke();
  
  graph.beginPath();
  graph.lineWidth = 8;
  graph.strokeStyle = 'rgba(0,0,0,1.0)';
  graph.moveTo(xoPointsMapped[0][0], xoPointsMapped[0][1]);
  graph.lineTo(xoPointsMapped[1][0], xoPointsMapped[1][1]);
  graph.moveTo(xoPointsMapped[2][0], xoPointsMapped[2][1]);
  graph.lineTo(xoPointsMapped[3][0], xoPointsMapped[3][1]);
  graph.stroke();

  });

  
};



service.drawXbit = function(graph, xbit){

  xbit.forEach(function(instance){
    // graph.beginPath();
    graph.strokeStyle = 'rgba(0,0,0,1.0)';
     graph.lineJoin = 'round';
     graph.lineCap = 'round';

    graph.fillStyle = 'rgba('+instance.colorR+','+instance.colorG+','+instance.colorB+','+instance.colorA+')'; /// Randomize...
    graph.lineWidth = 2;
  var xpoints =  drawCircle(graph, instance.locX, instance.locY, 0.25, 7);
  var xoPoints = [
			[instance.locX+0.1, instance.locY+0.1],
			[instance.locX-0.1, instance.locY-0.1],
			[instance.locX-0.1, instance.locY+0.1],
			[instance.locX+0.1, instance.locY-0.1]
		];

   var xoPointsMapped = [
			Matrix.map([xoPoints[0][0], xoPoints[0][1], 1]),
			Matrix.map([xoPoints[1][0], xoPoints[1][1], 1]),
			Matrix.map([xoPoints[2][0], xoPoints[2][1], 1]),
			Matrix.map([xoPoints[3][0], xoPoints[3][1], 1])
		];


  graph.beginPath();
  graph.lineWidth = 5;
  graph.moveTo(xoPointsMapped[0][0], xoPointsMapped[0][1]);
  graph.lineTo(xoPointsMapped[1][0], xoPointsMapped[1][1]);
  graph.moveTo(xoPointsMapped[2][0], xoPointsMapped[2][1]);
  graph.lineTo(xoPointsMapped[3][0], xoPointsMapped[3][1]);
  graph.stroke();
  
 

  });

  
};

service.flagReadoutImgs = [{},{},{},{}];
function fillFlagReadoutImgObjs(id){

  if(service.flagReadoutImgs[id].htmlImg === null || service.flagReadoutImgs[id].htmlImg === undefined){
	var htmlIMG = new Image;
	switch(id){
	case 0:
 	  htmlIMG.src = 'public/img/noflagsV.png';

	break;
	case 1:
 	  htmlIMG.src = 'public/img/1flagV.png';
	break;
	case 2:
	  htmlIMG.src = 'public/img/2flagsV.png';
	break;
	case 3:
	  htmlIMG.src = 'public/img/all3flagsV.png';
	break;
	default:
	   htmlIMG.src = 'public/img/noflagsV.png';
	break;
	}
     
      
	service.flagReadoutImgs[id].htmlImg = htmlIMG;
      
    }

}



service.draXflags = function(graph, xflags){

xflags.forEach(function(instance){

    graph.strokeStyle = 'rgba(0,0,0,1.0)';
    graph.lineJoin = 'round';
    graph.lineCap = 'round';
    graph.lineWidth = 2;
    graph.fillStyle = 'rgba(255, 0,0, 1.0)';
  
  
  var xst = instance.x;
  var yst = instance.y;

  var xoFlagPoints = [
			[xst-0.3, yst+0.25],
			[xst+0.2, yst+0.25],
			[xst+0.45, yst],
			[xst+0.20, yst-0.25],
			[xst-0.30, yst-0.25]
		];

  var xoFlagPointsMapped = [
			Matrix.map([xoFlagPoints[0][0], xoFlagPoints[0][1], 1]),
			Matrix.map([xoFlagPoints[1][0], xoFlagPoints[1][1], 1]),
			Matrix.map([xoFlagPoints[2][0], xoFlagPoints[2][1], 1]),
			Matrix.map([xoFlagPoints[3][0], xoFlagPoints[3][1], 1]),
			Matrix.map([xoFlagPoints[4][0], xoFlagPoints[4][1], 1])
		];

  
   graph.beginPath();
   graph.moveTo(xoFlagPointsMapped[0][0],xoFlagPointsMapped[0][1]);
   graph.lineTo(xoFlagPointsMapped[1][0],xoFlagPointsMapped[1][1]);
   graph.lineTo(xoFlagPointsMapped[2][0],xoFlagPointsMapped[2][1]);
   graph.lineTo(xoFlagPointsMapped[3][0],xoFlagPointsMapped[3][1]);
   graph.lineTo(xoFlagPointsMapped[4][0],xoFlagPointsMapped[4][1]);
   graph.closePath();
   graph.stroke(); 
   graph.fill();

  var xoFlagPoints = [
			[xst+0.20, yst+0.25],
			[xst-0.30, yst-0.25],
			[xst-0.30, yst+0.25],
			[xst+0.20,yst-0.25]
		];

  var xoFlagPointsMapped = [
			Matrix.map([xoFlagPoints[0][0], xoFlagPoints[0][1], 1]),
			Matrix.map([xoFlagPoints[1][0], xoFlagPoints[1][1], 1]),
			Matrix.map([xoFlagPoints[2][0], xoFlagPoints[2][1], 1]),
			Matrix.map([xoFlagPoints[3][0], xoFlagPoints[3][1], 1])
		];


  graph.beginPath();
  graph.moveTo(xoFlagPointsMapped[0][0], xoFlagPointsMapped[0][1]);
  graph.lineTo(xoFlagPointsMapped[1][0], xoFlagPointsMapped[1][1]);
  graph.moveTo(xoFlagPointsMapped[2][0], xoFlagPointsMapped[2][1]);
  graph.lineTo(xoFlagPointsMapped[3][0], xoFlagPointsMapped[3][1]);
  graph.stroke();

});


};




service.drawCaptureFlagsReadout = function(graph, numFlags){

 if(numFlags >= 0 && numFlags <=3){
	fillFlagReadoutImgObjs(numFlags);
 		graph.drawImage(service.flagReadoutImgs[numFlags].htmlImg, Global.screenWidth-40, Global.screenHeight-150, 40, 90);
 
 }

};



return service;
}]);


};  