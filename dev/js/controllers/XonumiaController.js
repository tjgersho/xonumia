require('angular');
require('angular-ui-router');
var $ = require('jquery');

var io = require('socket.io-client');
var SAT = require('sat');

var VectCollision = SAT.Vector;
var CircleCollision = SAT.Circle;

var quadtree = require('simple-quadtree');

var gameconfig = require('json-loader!../../../config.json');


import 'bootstrap/dist/js/bootstrap';

//var Canvas = require('../canvas');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('XonumiaController', 
	['$window', '$scope', 'loggedin', '$http', '$q', '$state', 'Global', 'User', 'Canvas', '$rootScope', '$timeout', 'Matrix', 'Levels', 'Draw', 'Cart', 

    function($window, $scope, loggedin, $http, $q, $state, Global, User, Canvas, $rootScope, $timeout, Matrix, Levels, Draw, Cart){
    //console.log("XonumiaController");

var self = this;  //Controller THIS

if(!!$state.params.level){
	self.levelSelect = $state.params.level;
}else{
self.levelSelect = '1';
}

var socket;
var reason;




var player;
var playerSentMoves = [];





var timeNow = Date.now();
var lastTime = timeNow;
var dt = 0.02;
var moveId = 0;

var xnum = [];
var xbit = [];

var xflags = [];
var xflagsFound = 0;


var xnumClientCollision = [];
var xbitClientCollision = [];

var viruses = [];
var fireFood = [];
var users = [];
self.leaderboardXbits = [];
self.leaderboardXnums = [];
var target;

var visibleBorderSetting;
var showMassSetting;
var continuitySetting;
var roundFoodSetting;
var c;
var graph;

var cvstemp;
var tempCtx;

var restartButton;

const zoom = 100;
var cellCountInView;


var map = {};
map.tiles = [];
map.start = [];
map.finish = [];

var mapBuilds = [];
self.levels = [];


self.canSendMoveInputs = false;

self.levelSelectName = '';

self.showLeaderBoard = false;
self.showXbitLeaderBoard = false;



var loadgif = document.getElementById('loading');

Global.advs = [];
Global.playerFinishMapOnce = true;

require('./XonumiaMethods/test.js').method();

function startGame() {

    if (!socket) {
        socket = io({query:"userId="+User.id+"&level="+self.levelSelect});
        setupSocket(socket);
    }
    socket.emit('spawn', player);
    window.canvas.socket = socket;
    Global.socket = socket;
}




$('body').on('contextmenu', '#cvs', function(e){return false;});

function initializeGame(){


Global.gameStart = false;
Global.playerFinishMapOnce = true;

loadgif.style.display = 'block';


socket =  null;


player = {
    id: -1,
    userId: User.id,
    x: 0.5,
    y: 0.5,
    screenWidth: Global.screenWidth,
    screenHeight: Global.screenHeight,
    target: {x: 0, y: 0},
    cellMoves: {
            l: false,
            u: false,
            r: false,
            d: false
     },
    level: self.levelSelect,
    levelBounds : [],
    playerConfig: {
   		 border: 2,
    	        textColor: '#FFFFFF',
    		 textBorder: '#000000',
               textBorderSize: 3,
    		 defaultSize: 30,
		 bodyColorR: 255,
		 bodyColorG: 0,
               bodyColorB: 0,
               bodyColorA: 0.8,
 		 borderColorR: 0,
		 borderColorG: 255,
               borderColorB: 0,
               borderColorA: 0.8
	},
	xnums: [],
	xNumsVal: function(){
		var value = 0
		for(var i=0; i<player.xnums.length; i++){
			value = value + player.xnums[i].valDollar;
		}
		return Math.round(value,2);
	 },
	xnumsLength: 0,
	xnumsVal: 0,
	xbits: 0
};

player.maptree = quadtree(0,0,5,5);

Global.player = player;


users = [];

//target = {x: 0, y: 0};
//Global.target = target;
//console.log(Global.target);

window.canvas = Canvas.getCanvas();


c = window.canvas.cv;

graph = c.getContext('2d');

Global.updateScreenDims();
 setCellCount();

 cvstemp = document.getElementById('cvsTempMemory');
tempCtx = cvstemp.getContext('2d');
cvstemp.width = Global.screenWidth;
cvstemp.height = Global.screenHeight;
 
 
Global.advs = [];
map.tiles = [];

Global.displayname = User.username;

getLevels().then(function(resp){

console.log("GET LEVELS RESP");
console.log(resp);
           
      startGame();

},function(err){
    console.log('Get LEVELS Err');
    console.log(err);

 });

getAdvs();


}

function initLevelChange(){


Global.gameStart = false;
self.canSendMoveInputs = false;
Global.needNewGlobalMap = true;
Global.playerFinishMapOnce =  true;
player.x =0.5;

player.y = 0.5;
player.cellX = 0.5;
player.cellY = 0.5;
player.speed = 0;
Global.player = player;
window.canvas.target.x = 0;
window.canvas.target.y = 0;

users = [];

playerSentMoves = [];

Global.advs = [];
map.tiles = [];

getLevels().then(function(resp){


    startGame();

},function(err){
    console.log('Get LEVELS Err');
    console.log(err);

 });
getAdvs();
}


function setMatrix(){

     Matrix.reset();
  if(Global.screenWidth > Global.screenHeight){

        Matrix.scale([1/cellCountInView*(zoom/100)*Global.screenHeight, -1/cellCountInView*(zoom/100)*Global.screenHeight, 1]);  //Flips device coords to logical coors Y UP
        Matrix.translate([0, Global.screenHeight, 0]); // Moves Draw COORDS down to bottom left of device

     Global.screenCellsWidth  = (Global.screenWidth/Global.screenHeight)*cellCountInView*(100/zoom);
     Global.screenCellsHeight = cellCountInView*(100/zoom);
    }else{

        Matrix.scale([1/cellCountInView*(zoom/100)*Global.screenWidth, -1/cellCountInView*(zoom/100)*Global.screenWidth, 1]);  //Flips device coords to logical coors Y UP
        Matrix.translate([0, Global.screenWidth*(Global.screenHeight/Global.screenWidth), 0]); // Moves Draw COORDS down to bottom left of device
     
     Global.screenCellsWidth  = cellCountInView*(100/zoom); 
     Global.screenCellsHeight = (Global.screenWidth/Global.screenHeight)*cellCountInView*(100/zoom);

    }

         Matrix.translate([Global.screenWidth/2, -Global.screenHeight/2, 0]);  //// Makes View Local Coordinates Center Screen
        console.log('SETMATRIX PLAYER ' , player);
      var playerPos = Matrix.map([player.x, player.y, 1]);

         console.log("PLAYRE POS " , playerPos);

         playerPos = Matrix.map([player.x, player.y, 1]);
    Matrix.translate([-playerPos[0]+Global.screenWidth/2, Global.screenHeight/2-playerPos[1], 0]); 

          console.log('SETMATRIX PLAYER after Matrix map... ' , player);
       // Matrix.translate([-playerPos[0]/2, -playerPos[1]/2, 0]);   //Moves Screen to Offset Position


}



self.logout = function() {
 

       Global.gameStart = false;

          if (Global.animLoopHandle) {
                window.cancelAnimationFrame(Global.animLoopHandle);
                Global.animLoopHandle = undefined;
            }
    socket.emit('logout', player);

    //window.canvas.reenviar = false;
   socket.close();
    User.logout(User.token);
    $state.go('login');

};


self.refresh = function () {

socket.emit('resetPos');

window.canvas.target.x = 0;
window.canvas.target.y = 0;

initLevelChange();

        
};


self.openMapIntroModal = function(){
   $('#mapIntroModal').modal({backdrop: 'static', keyboard: false});
   $('#mapIntroModal').modal('show');

   Global.gameStart = false;
};



self.closeMapIntroDialog = function(){
 if(self.mapStart){
  $('#mapIntroModal').modal('hide');
   self.openMapStartInfoModal();
 }else{
  $('#mapIntroModal').modal('hide');
  Global.gameStart = true;
 }
};


self.openMapStartInfoModal = function(){
   $('#mapStartModal').modal({backdrop: 'static', keyboard: false});
   $('#mapStartModal').modal('show');
   Global.gameStart = false;
};



self.closeMapStartInfoDialog = function(){
  $('#mapStartModal').modal('hide');
  Global.gameStart = true;
};


self.openMapEndNoticeModal = function(){

 if (Global.playerFinishedMap &&  Global.playerFinishMapOnce){
	console.log('OPEN ENd Notice Dialog');
   $('#mapEndModal').modal({backdrop: 'static', keyboard: false});
   $('#mapEndModal').modal('show');
    Global.playerFinishedMap = false;
    Global.playerFinishMapOnce =  false;

 }
};



self.closeMapEndNoticeDialog = function(){
	console.log("Close End Notice Dialog");
  $('#mapEndModal').modal('hide'); 
  $('#mapEndModal').on('hidden.bs.modal', function () {
     Global.playerFinishedMap = false;
      self.goto('dashboard');
  });
   
};


function setupSocket(socket) {
    // Handle ping.

    socket.on('pongcheck', function () {
      
        var latency = Date.now() - Global.startPingTime;
       //console.log('Latency: ' + latency + 'ms');
       // window.chat.addSystemLine('Ping: ' + latency + 'ms');
    });

    // Handle error.
    socket.on('connect_failed', function () {
        socket.close();
        Global.disconnected = true;
        //console.log('connection failed');
    });

    socket.on('disconnect', function () {
        socket.close();
        Global.disconnected = true;
        //console.log('Disconnect..');
    });

    // Handle connection.
    socket.on('welcome', function (playerServer) {
        console.log("WELCOME ");
        console.log(playerServer);
	 
        player.id = playerServer.id;
        player.name = Global.displayname;
        player.screenWidth = Global.screenWidth;
        player.screenHeight = Global.screenHeight;
	 player.screenCellsWidth = Global.screenCellsWidth;
	 player.screenCellsHeight = Global.screenCellsHeight;
        player.token = User.token;
        player.target = window.canvas.target;
	 player.x = playerServer.x;
	 player.y = playerServer.y;
	 player.speed = playerServer.speed;
	 player.radius = playerServer.radius;
	 player.levelBounds = playerServer.levelBounds;
	 player.xnumsLength = playerServer.xnumlength;
	 
	 player.xbits = playerServer.xbits;
        Global.player = player;

        socket.emit('gotit', player);
        moveId = 0;
    
	 c.focus();
      
       
    });
    
     socket.on('startGame', function (data) {
		Global.disconnected = false;
            console.log('START GAME');
            console.log(data);
	     self.levelSelect = data.level;
	     console.log('Set Level Select from Strat Game..');
		 console.log(self.levelSelect);
              $scope.$apply();
 		


	     map.tiles = data.map.tiles;
		map.tiles.forEach(function(t){
                    var ti = {x: t.locX, y: t.locY, w:1, h:1, gu: t.gu, gr: t.gr, gd: t.gd, gl: t.gl};
                    player.maptree.put(ti);
                });
		console.log('START GAME SELF');
		
		self.mapIntro = data.map.mapIntro;
		self.mapStart = data.map.startSquare;
		self.mapEnd = data.map.endSquare;
		console.log(self);
		
		if(data.x !== '' && data.x !== undefined && data.x !== null){
			console.log("SETTING START CELL!");
			console.log(data.map.startSquare);
			console.log(data);
			player.x = data.x;
       		player.y = data.y;
       		player.cellX =  data.cellX;
        		player.cellY = data.cellY;
              }
	        if(data.map.startXtile !== '' && data.map.startXtile !== undefined && data.map.startXtile !== null){
			 map.start = [data.map.startXtile, data.map.startYtile];
               }
                
	        if(data.map.finishXtile !== '' && data.map.finishXtile !== undefined && data.map.finishXtile !== null){
			map.finish = [data.map.finishXtile, data.map.finishYtile];
               }

		if(data.map.finishXtile !== '' 
			&& data.map.finishXtile !== undefined 
				&& data.map.finishXtile !== null
				&& data.map.startXtile !== '' 
				&& data.map.startXtile !== undefined 
				&& data.map.startXtile !== null
			){
			
		   xflagsCreate(data.levelBounds);
			
			player.hasAllThreeFlags = data.hasAllThreeFlags;
		     console.log('Has All Three Flags !!??');
			console.log(player.hasAllThreeFlags);

		}
                
                    
	      loadgif.style.display = 'none';

             setMatrix();
             $scope.$apply();
		if(self.mapIntro){
		   self.openMapIntroModal();
 		}else if(self.mapStart){
		  self.openMapStartInfoModal();
  		}else{
		  Global.gameStart = true;	
		}

              

     	        self.canSendMoveInputs = true;
              
                if (!Global.animLoopHandle){
                  animloop();
                }
        	refreshLevelPulseVal();

      });



	socket.on('levelChangeWelcome', function(data){
		console.log('LevelChangeWelcome socketCallback');
		console.log(data);
              initLevelChange();
      });

    socket.on('playerDied', function (data) {
        //console.log("Player Died");
      //  window.chat.addSystemLine('{GAME} - <b>' + (data.name.length < 1 ? 'An unnamed cell' : data.name) + '</b> was eaten.');
    });

    socket.on('playerDisconnect', function (data) {
        //console.log('PlayerDisconnect');

      //  window.chat.addSystemLine('{GAME} - <b>' + (data.name.length < 1 ? 'An unnamed cell' : data.name) + '</b> disconnected.');
    });

    

    socket.on('leaderboardXbits', function (data) {
        self.leaderboardXbits = data;
        $scope.$apply();
    });

    socket.on('leaderboardXnums', function (data) {
        self.leaderboardXnums = data;
	$scope.$apply();
    });

    socket.on('serverMSG', function (data) {
       // window.chat.addSystemLine(data);
       //console.log('ServerMSG');
       //console.log(data);
    });


    socket.on('setAdvHasInterest', function (data) {
        console.log('SET ADV HAS INTERST');
	 console.log(data);

        ///update advHasInterst
	 for(var i=0; i<Global.advs.length; i++){
	    if(Global.advs[i].id === data.advId){
			Global.advs[i].sponsorshipInterest = true;
           }

       }

    });
    

    // Handle movement.
    socket.on('serverTellPlayerMove', function (userData, xnumList, xbitList) {



  
      
       var playerData;
        for(var i =0; i< userData.length; i++) {
            if(typeof(userData[i].id) === "undefined") {
               playerData = userData.splice(i,1)[0];
                break;
            }
        }
	
	
        

      if(playerData.foundFinish && Global.playerFinishMapOnce){

	  ///finish Confirmed!///
            Global.gameStart = false;
            socket.emit('logout', player);
            self.openMapEndNoticeModal();
	 }	
       


       player.playerConfig = playerData.playerConfig;
	player.xnumsLength = playerData.xnumsLength;
 	
	player.xnumsVal = playerData.xnumsVal;
	player.xbits = playerData.xbits;
	

      player.levelBounds = playerData.levelBounds;


      if(playerData.moreMapTiles){
	
	 Global.needNewGlobalMap = true;

	 map.tiles = [];
	 map.tiles = playerData.newTiles;
        
        player.maptree.clear();
          map.tiles.forEach(function(t){
                    var ti = {x: t.locX, y: t.locY, w:1, h:1, gu: t.gu, gr: t.gr, gd: t.gd, gl: t.gl};
                    player.maptree.put(ti);
                });
         }

	var processedLength = playerData.processedMoves.length;

	var sentmovesLength = playerSentMoves.length;

	if(processedLength > 0 &&  sentmovesLength > 0){

	var AuthoritiveMove = playerData.processedMoves[processedLength-1];


        var moveIdDiff = AuthoritiveMove.moveId - playerSentMoves[0].moveId;


    if(moveIdDiff>=0){ 
       
        var q=0;
        while(moveIdDiff > 0 && q < 1000){
            playerSentMoves.splice(0,1);
            q++;
            moveIdDiff = AuthoritiveMove.moveId - playerSentMoves[0].moveId;
        }

        var serverMatchesPrediction = false;
        ////ShortCircuit Solution..

        var stabilized = true;

             if(playerSentMoves[0].moveId === AuthoritiveMove.moveId){
  
                    if(Math.abs((playerSentMoves[0].clientPostMoveX - AuthoritiveMove.postMoveX)) < 0.001 
                            && Math.abs((playerSentMoves[0].clientPostMoveY - AuthoritiveMove.postMoveY))< 0.001){

                          serverMatchesPrediction = true;  /// Sweeet then no need for more reconciliation..
                    
                 
                    }

                     if(Math.abs((playerSentMoves[0].clientPostMoveX - AuthoritiveMove.postMoveX)) > 1 
                            || Math.abs((playerSentMoves[0].clientPostMoveY - AuthoritiveMove.postMoveY)) > 1){
                  
				 //stabilized = false;
			}
             
  
               }  
            


          if(!serverMatchesPrediction && stabilized){


            playerSentMoves[0].clientPostMoveX = AuthoritiveMove.postMoveX;
            playerSentMoves[0].clientPostMoveY = AuthoritiveMove.postMoveY;

              console.log('REPLAY FORWARD MOVES - Server Reconsiliation');

		var sentmvlength = playerSentMoves.length;
            
                for(var i = 1; i< sentmvlength; i++){

	             playerSentMoves[i].clientPostMoveX = playerSentMoves[i-1].clientPostMoveX + (playerSentMoves[i].clientPostMoveX - playerSentMoves[i].clientPreMoveX);
       	      playerSentMoves[i].clientPostMoveY = playerSentMoves[i-1].clientPostMoveY + (playerSentMoves[i].clientPostMoveY - playerSentMoves[i].clientPreMoveY);

                    }
			

                    player.x = playerSentMoves[sentmvlength-1].clientPostMoveX;
                    player.y = playerSentMoves[sentmvlength-1].clientPostMoveY; 
                   
                  setMatrix();
                
            }


            ///////////////////////////////////////////////////////////////////
            ////Algorithm to chop playerSentMoves Array by what was processed..
           playerSentMoves.splice(0,1);


        }else{
            player.x = AuthoritiveMove.postMoveX;
            player.y = AuthoritiveMove.postMoveY;
            setMatrix();
                
        }

   }


	//console.log('XNUM');
	//console.log(xnumList);

	 xnum = [];
	 xbit = [];
	 users = [];
        users = userData;  ///All other users in view!!!
	

        var foundXnList = [];
	 xnumList = xnumList.filter(function(xn){
		var xncollisionLen = xnumClientCollision.length;
		
		for(var i=0; i<xncollisionLen; i++){
			if(xnumClientCollision[i].id === xn.id){
			foundXnList.push(xnumClientCollision[i]);
			return false;
                     }
              }
		
		return true;

         });
	 
        xnumClientCollision = foundXnList;
	
        xnum = xnumList;  ///Xnums in view!!!


        var foundXbList = [];
	 xbitList = xbitList.filter(function(xn){
		var xbcollisionLen = xbitClientCollision.length;
		
		for(var i=0; i<xbcollisionLen; i++){
			if(xbitClientCollision[i].id === xn.id){
			foundXbList.push(xbitClientCollision[i]);
			return false;
                     }
              }
		
		return true;

         });
	 
        xbitClientCollision = foundXbList;

	 xbit = xbitList;
	

   
    });

    // Death.
    socket.on('RIP', function () {
        Global.gameStart = false;
        Global.died = true;
        window.setTimeout(function() {
          
            Global.died = false;
            if (Global.animLoopHandle) {
                window.cancelAnimationFrame(Global.animLoopHandle);
                Global.animLoopHandle = undefined;
            }
            
        }, 2500);
        //socekt.save();
       // socket.close();
    });

    socket.on('kick', function (data) {
        Global.gameStart = false;
        reason = data;
        Global.kicked = true;
          window.setTimeout(function() {
         
                   Global.kicked = false;
            if (Global.animLoopHandle) {
                window.cancelAnimationFrame(Global.animLoopHandle);
                Global.animLoopHandle = undefined;
            }
            
        }, 2500);

        socket.close();

    });


}  ///END OF SOCKET SETUP




function valueInRange(min, max, value) {
    return Math.min(max, Math.max(min, value));
}




/////////////////////////////////////////////////////
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.msRequestAnimationFrame     ||
            function( callback ) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

window.cancelAnimFrame = (function(handle) {
    return  window.cancelAnimationFrame     ||
            window.mozCancelAnimationFrame;
})();


function animloop() {
    Global.animLoopHandle = window.requestAnimFrame(animloop);
    gameLoop();
    moveLoop();
}



function  updatePlayerCellMoves(player){
			 
    var searchCells = player.maptree.get({x:player.x, y: player.y, w: 3, h: 3});
	

      var searchCellLength = searchCells.length;

        var cell = {};
    for(var i=0; i<searchCellLength; i++){
        if(searchCells[i].x === player.cellX && searchCells[i].y === player.cellY){
            cell = searchCells[i];
            break;
        }
    }

  if(!!cell){
   player.cellMoves.l = !cell.gl;
   player.cellMoves.r = !cell.gr;
   player.cellMoves.u = !cell.gu;
   player.cellMoves.d = !cell.gd;

   return cell;
 }else{

    return false;
 }


}

function getAcceptableTarget(player, target, cell){


if(!!cell){
    
    player.cellMoves.l = !cell.gl;
    player.cellMoves.r = !cell.gr;
    player.cellMoves.u = !cell.gu;
    player.cellMoves.d = !cell.gd;



    if(!player.cellMoves.l && (player.x-player.radius) <= cell.x-0.5){
        if(target.x < 0) {
            target.x = 0;
        }
    }
    if(!player.cellMoves.u && (player.y+player.radius)>=cell.y+0.5){
        if(target.y > 0) {
            target.y = 0;
        }
    }
    if(!player.cellMoves.r && (player.x+player.radius)>=cell.x+0.5){
        if(target.x > 0) {
            target.x = 0;
        }
    }
    if(!player.cellMoves.d && (player.y-player.radius)<=cell.y-0.5){
        if(target.y < 0) {
            target.y = 0;
        }
    }



}else{
    console.log("NO CELL FOUND IN CELL BUFFER!!!");
    player.cellMoves.l = true;
    player.cellMoves.r = true;
    player.cellMoves.u = true;
    player.cellMoves.d = true;
}




return target;

}




function  adjustInMaze(player, cell){

if(!!cell){
    
    player.cellMoves.l = !cell.gl;
    player.cellMoves.r = !cell.gr;
    player.cellMoves.u = !cell.gu;
    player.cellMoves.d = !cell.gd;



    if(!player.cellMoves.l && (player.x-player.radius) <= cell.x-0.5){
        
            player.x = cell.x+player.radius-0.5;
        
    }
    if(!player.cellMoves.u && (player.y+player.radius)>=cell.y+0.5){
      
            player.y = cell.y-player.radius+0.5;
        
    }
    if(!player.cellMoves.r && (player.x+player.radius)>=cell.x+0.5){
       
            player.x = cell.x-player.radius+0.5;
      
    }
    if(!player.cellMoves.d && (player.y-player.radius)<=cell.y-0.5){
     
            player.y = cell.y+player.radius-0.5;
       
    }



}else{

    player.cellMoves.l = true;
    player.cellMoves.r = true;
    player.cellMoves.u = true;
    player.cellMoves.d = true;
}



}


function maintainInBounds(player){

   if((player.x + player.radius) >= player.levelBounds[1]){
                player.x = player.levelBounds[1]-player.radius; 
            }
            
            if((player.x - player.radius) <= player.levelBounds[3]){
                player.x = player.levelBounds[3]+ player.radius;
            }
            if((player.y + player.radius) >= player.levelBounds[0]){
                player.y = player.levelBounds[0] - player.radius;
            }
            
            if((player.y - player.radius) <= player.levelBounds[2]){
                player.y = player.levelBounds[2] + player.radius;
            }
}

function movePlayer(movement){

    

        player.cellX =  Math.floor(player.x) + 0.5;
        player.cellY =  Math.floor(player.y) + 0.5;

       var currentCellMove = updatePlayerCellMoves(player);
       
        var target = {
            x:  player.x - player.x + movement.target.x,
            y:  player.y - player.y - movement.target.y
        };



          target = getAcceptableTarget(player, target, currentCellMove);


        var dist = Math.sqrt(Math.pow(target.y, 2) + Math.pow(target.x, 2));
        var deg = Math.atan2(target.y, target.x);

        player.speed = dist*0.01;


        if (player.speed >= 2.0){
            player.speed = 2.0;
        }

     

        var deltaY = player.speed * Math.sin(deg) * movement.dt;
        var deltaX = player.speed * Math.cos(deg) * movement.dt;


        if(target.x === 0){
            deltaX = 0;
        }
        if(target.y === 0 ){
            deltaY = 0;
        }


        if (!isNaN(deltaY)) {
            player.y += deltaY;
        }
        if (!isNaN(deltaX)) {
            player.x += deltaX;
        }

      adjustInMaze(player, currentCellMove);

      maintainInBounds(player);


}


function xnumPlayerCollision(player){
 
var searchXnums = xnum;
		
     var xnumcollision = false;
      var searchXnumsLength = searchXnums.length;
       var collidedxnum = {};
	

       for(var i=0; i<searchXnumsLength; i++){
        if(searchXnums[i].locX === player.cellX && searchXnums[i].locY === player.cellY){
	     collidedxnum = searchXnums[i];
	     xnumClientCollision.push(collidedxnum);
	     xnumcollision = true;
            break;
        }
       }

	if(xnumcollision){
		console.log('client side collision');
		console.log(collidedxnum.id);
	    xnum = xnum.filter(function(x){
		
		return x.id !== collidedxnum.id;

	   });

	}
}

function xbitPlayerCollision(player){
var searchXbits = xbit;
		
     var xbitcollision = false;
      var searchXbitsLength = searchXbits.length;
       var collidedxbit = {};
	

       for(var i=0; i<searchXbitsLength; i++){
        if(searchXbits[i].locX === player.cellX && searchXbits[i].locY === player.cellY){
	     collidedxbit = searchXbits[i];

	     xbitClientCollision.push(collidedxbit);
	     xbitcollision = true;
            break;
        }
       }

	
	if(xbitcollision){
		 xbit = xbit.filter(function(x){
		
		  return x.id !== collidedxbit.id;

	        });

	}


}

function xflagsCollision(player){
       for(var i=0; i<xflags.length; i++){
        if(xflags[i].x === player.cellX && xflags[i].y === player.cellY){
	    xflags.splice(i, 1);
	    xflagsFound++;
		if(xflagsFound === 3){
			socket.emit('foundAllFlags', {player: player});
		}
	    break;
        }
       }
}


function moveLoop(){

if (!Global.disconnected) {
        if (Global.gameStart  &&  self.canSendMoveInputs) {
            
           timeNow = Date.now();
           dt = (timeNow - lastTime)/1000;
           lastTime = timeNow;
           moveId++;

         var moveUpdates = {'target': window.canvas.target, 'dt': dt, moveId: moveId};


    
         var pmapoffset = Matrix.map([player.x, player.y, 1]);
               
                      moveUpdates.clientPreMoveX =  player.x;
                     moveUpdates.clientPreMoveY = player.y;
                      

                      movePlayer(moveUpdates);
           
  
                moveUpdates.clientPostMoveX =  player.x;
                     moveUpdates.clientPostMoveY = player.y;


                playerSentMoves.push(moveUpdates);
                socket.emit('0', moveUpdates); // playerSendTarget "Heartbeat".
               


             var pdatamapoffset = Matrix.map([player.x, player.y, 1]);
            var xoffset = pmapoffset[0] - pdatamapoffset[0];
            var yoffset = pmapoffset[1] - pdatamapoffset[1];
       
 
           Matrix.translate([xoffset, yoffset, 0]);   //Moves Screen to Offset Position
   
        } 
  	   //Client Side Collision Detection!
	xnumPlayerCollision(player);
       xbitPlayerCollision(player);
	xflagsCollision(player);

	if(map.finish.length > 0){
		if(map.finish[0] ===  player.cellX && map.finish[1] ===  player.cellY){
		   if(xflagsFound === 3){
                 Global.gameStart = false;
                 Global.playerFinishedMap = true;
		  }else{
		   	self.NeedMoreXFlagsModal();
		  }
             }	
       }
    }


 
}

Global.needNewGlobalMap = true;
var gamelooptimeNow = Date.now();
var gameloopdt = 0;
var gamelooplastTime = gamelooptimeNow;
var gameTime = gameloopdt;

var drawName = true;
var drawXnumInfo = false;
var drawXnumOffuntil = false;


function gameTimeState(gameTime){  /////Set Game Variables based on run time of the game... ie.. turn name off after 15 seconds..
			//then turn on drawXnum after 20 seconds for 5 seconds.

switch (true){
  case gameTime < 15:
     drawName = true;
     drawXnumInfo = false;
    break;
  case  gameTime >= 20 && gameTime <35:
    drawName = false;
    drawXnumInfo = true;
   break;
  default:
    drawName = false;
    drawXnumInfo = false;
   break;
 }

}

function gameLoop() {
     gamelooptimeNow = Date.now();
     gameloopdt = (gamelooptimeNow - gamelooplastTime)/1000;
     gamelooplastTime = gamelooptimeNow;
  
	
    if (Global.died) {
        graph.fillStyle = '#333333';
        graph.fillRect(0, 0, Global.screenWidth, Global.screenHeight);

        graph.textAlign = 'center';
        graph.fillStyle = '#FFFFFF';
        graph.font = 'bold 30px sans-serif';
        graph.fillText('You died!', Global.screenWidth / 2, Global.screenHeight / 3);
    }
    else if (!Global.disconnected) {
        if (Global.gameStart) {
           
              gameTime =  gameTime + gameloopdt;
              gameTimeState(gameTime)
             

            graph.fillStyle = Global.backgroundColor;
            graph.fillRect(0, 0, Global.screenWidth, Global.screenHeight);

            Draw.drawBounds(graph, player.levelBounds);

  
             Draw.drawMap(graph, map);

	      //  if(Global.needNewGlobalMap){

		//  Draw.createMapImage(graph, map);

             //  }

 	     //  Draw.drawMapImage(graph);
           
 
 
             
               if(!!map.start[0] && !!map.start[1]){ 
                 Draw.drawStartCell(graph, map.start);
               }

               if(!!map.finish[0] && !!map.finish[1]){ 
                 Draw.drawFinishCell(graph, map.finish);
               }

	     

            Draw.drawAdvs(graph, Global.advs, zoom, tempCtx);

            Draw.drawOtherPlayers(graph, users, player);
            Draw.drawXnum(graph, xnum);
	     Draw.drawXbit(graph, xbit);
	     Draw.draXflags(graph,xflags);
            Draw.drawPlayer(graph, player, drawName, drawXnumInfo);
  
             

           if(Global.isAdvClick){
            console.log('IS AN ADV CLICK!!!!');
            Global.isAdvClick = false;
            self.buyAdvModal();
           }

	    if(Global.isAdvClickforLink){
            console.log('IS AN ADV CLICK FOR LINK!!!!');
            Global.isAdvClickforLink = false;
            self.AdvClickforLinkModal();
           }

	    if(!!map.finish[0] && !!map.finish[1] && !!map.start[0] && !!map.start[1]){
		Draw.drawCaptureFlagsReadout(graph, xflagsFound);
 	    }

           

        }else {

		if(Global.playerFinishedMap){
            		graph.fillStyle = '#333333';
            		graph.fillRect(0, 0, Global.screenWidth, Global.screenHeight);

            		graph.textAlign = 'center';
            		graph.fillStyle = '#FFFFFF';
           		graph.font = 'bold 30px sans-serif';
          		graph.fillText('Maze Complete!!', Global.screenWidth / 2, Global.screenHeight / 3);
			 loadgif.style.display = 'block';

		}else{
		       graph.fillStyle = '#333333';
              	graph.fillRect(0, 0, Global.screenWidth, Global.screenHeight);

              	graph.textAlign = 'center';
              	graph.fillStyle = '#FFFFFF';
              	graph.font = 'bold 30px sans-serif';
              	graph.fillText('Game Over!', Global.screenWidth / 2, Global.screenHeight / 3);
	    }

      }
    } else {
        graph.fillStyle = '#333333';
        graph.fillRect(0, 0, Global.screenWidth, Global.screenHeight);

        graph.textAlign = 'center';
        graph.fillStyle = '#FFFFFF';
        graph.font = 'bold 30px sans-serif';
        if (Global.kicked) {
            if (reason !== '') {
                graph.fillText('You were kicked for:', Global.screenWidth / 2, Global.screenHeight / 3 - 20);
                graph.fillText(reason, Global.screenWidth / 2, Global.screenHeight / 3 + 20);
            }
            else {
                graph.fillText('You were kicked!', Global.screenWidth / 2, Global.screenHeight / 3);
            }
        }
        else {
            if(!Global.gameStart){
              graph.fillText('Disconnected!', Global.screenWidth / 2, Global.screenHeight / 3);
            }else{
               graph.fillText('Connecting...', Global.screenWidth / 2, Global.screenHeight / 3);  
            }   
        }
    }
}

function randomInRange(from, to){
    return Math.floor(Math.random() * (to - from)) + from;
}

function randomPosition(bounds) {
    return {
        x: randomInRange(bounds[3]+0.5, bounds[1]-0.5),
        y: randomInRange(bounds[2]+0.5, bounds[0]-0.5)
    };
}


function xflagsCreate(bounds){

  console.log('Create XFlags!');
  console.log(bounds);

   xflags[0] = randomPosition(bounds);
   xflags[1] = randomPosition(bounds);
   xflags[2] = randomPosition(bounds);

   xflagsFound = 0;
  console.log('XFLAGS ARRAY');
  console.log(xflags);

}


function setCellCount(){

    switch (true){
        case Global.screen_min_dim() < 400:
            cellCountInView = 6;
        break;
        case (Global.screen_min_dim() >= 400 && Global.screen_min_dim() < 600):
            cellCountInView = 8;
        break;
        default:
            cellCountInView = 12;
        break;
    }

    console.log("CELL COUONT IN VIEW");
    console.log(cellCountInView);

}

// window.addEventListener('resize', resize);

angular.element($window).bind('resize', function(){
  //Any time you attach event to $window with angular it becomes application wide Thus.. if state..

    if($state.is('play')){

 
    Global.updateScreenDims();

    if (!socket) return;

    player.screenWidth = Global.screenWidth;
    c.width = Global.screenWidth;
    player.screenHeight = Global.screenHeight;
    c.height = Global.screenHeight;

    setCellCount();

    
    //self.initScreen();
    setMatrix();
      console.log('Global ScreenCellsWidth');
      console.log(Global.screenCellsWidth);

   
    	 player.screenCellsWidth = Global.screenCellsWidth;
	 player.screenCellsHeight = Global.screenCellsHeight;
   
     socket.emit('windowResized', { screenWidth: Global.screenWidth, screenHeight: Global.screenHeight, screenCellsWidth:  Global.screenCellsWidth, screenCellsHeight: Global.screenCellsHeight });
    // $scope.$apply();
  }

});


var needMoreXFlagsModalOpen = false;

self.NeedMoreXFlagsModal = function(){
  
if(!needMoreXFlagsModalOpen){
 needMoreXFlagsModalOpen = true;
 loadgif.style.display = 'block';
 $('#NeedMoreXFlags').modal({backdrop: 'static', keyboard: false});
  $('#NeedMoreXFlags').modal('show');  
   Global.gameStart = false;
  }

};


self.AdvClickforLinkModal = function(){
   loadgif.style.display = 'block';
 $('#AdvClickForLink').modal({backdrop: 'static', keyboard: false});
  $('#AdvClickForLink').modal('show');  
   Global.gameStart = false;
   self.advClickforLink = Global.advClickforLink;
};


self.buyAdvModal = function(){
   loadgif.style.display = 'block';
 $('#buyAdvModal').modal({backdrop: 'static', keyboard: false});
  $('#buyAdvModal').modal('show');  
   Global.gameStart = false;
};


self.closeDialog = function(){
  loadgif.style.display = 'none';
  Global.gameStart = true;

 $timeout(function(){needMoreXFlagsModalOpen = false;},10000);
};

self.goBuyAdv = function(route){

$('#buyAdvModal').modal('hide'); 

if(Global.animLoopHandle){
  window.cancelAnimFrame(Global.animLoopHandle);  
  Global.animLoopHandle = undefined;
}

Global.gameStart = false;

   Cart.addAdv(Global.advBuy.id, Global.advBuy.locX, Global.advBuy.locY, Global.advBuy.width, Global.advBuy.height, self.levelSelect);
   $('#buyAdvModal').on('hidden.bs.modal', function () {
	console.log('Ad Vi ID');
	console.log( Global.advBuy.id );
     socket.emit('advHasInterest', {advId: Global.advBuy.id});
     socket.close();
     $state.go(route);
   });
};

self.goto = function(route){
    if(Global.animLoopHandle){
  window.cancelAnimFrame(Global.animLoopHandle);  
  Global.animLoopHandle = undefined;
}

Global.gameStart = false;
socket.close();

$state.go(route);
};

self.initScreen = function(){

    var minScreenDim =  Global.screen_min_dim();
  
    loadgif.style.height = Math.floor(minScreenDim * 0.2) + "px";

    loadgif.style.width =  Math.floor(minScreenDim * 0.2) + "px";
    loadgif.style.position = 'absolute';
    loadgif.style.top = Global.screenHeight/2- Math.floor(minScreenDim * 0.2)/2 + 'px';
    loadgif.style.left = Global.screenWidth/2- Math.floor(minScreenDim * 0.2)/2 + 'px';
   
};


function getUser(){


var showPmlogo = $timeout(function(){
   
User.isTokenValid().then(function(usr){


    User.username = usr.username;
    User.email = usr.email;
    User.id = usr.id;
//console.log(Global);

  //initializeGame();

   Global.gameStart = true;
       
         if (Global.animLoopHandle) {
                window.cancelAnimationFrame(Global.animLoopHandle);
                Global.animLoopHandle = undefined;
            }
        
       // Global.init();
        initializeGame();
   
},function(err){
//console.log('UserToken Loing ERR');
//console.log(err);
if(Global.animLoopHandle){
  cancelAnimFrame(Global.animLoopHandle);  
  Global.animLoopHandle = undefined;
}

 $timeout.cancel(showPmlogo);
    $state.go('login'); 

});

loadgif.src = 'img/loading.gif';

}, 1000);


}




function getMapTiles(){
var defered =  $q.defer();
  loadgif.style.display = 'block';
  map.tiles = [];

  var url = 'api/v1/tile?level='+self.levelSelect+'&locX=0&locY=0&w='+Math.floor(2*Global.screenWidth)+ '&h='+Math.floor(2*Global.screenHeight);
 Levels.getMapTiles(url).then(function(resp){
                mapBuilds = [];  ///Clear anything that has been updated.
                map.tiles = resp;

                map.tiles.forEach(function(t){
                    var ti = {x: t.locX, y: t.locY, w:1, h:1, gu: t.gu, gr: t.gr, gd: t.gd, gl: t.gl};
                    player.maptree.put(ti);
                });

              
               defered.resolve('Done TILES');
              
               //drawWorld();
 },function(err){
console.log('GET MAP ERROR');
                console.log(err);
                 defered.reject('Token Not Valid');
                    
 });


return defered.promise;
}


function getAdvs(){
 loadgif.style.display = 'block';
  Global.advs = [];

  var url = 'api/v1/adv?level='+self.levelSelect;
 Levels.getAdvs(url).then(function(resp){
              console.log('Get adVs');
              console.log(resp);
        Global.advs = resp;
	 
        loadgif.style.display = 'none';
    
 },function(err){
        console.log('GET advs ERROR');
        console.log(err);
       loadgif.style.display = 'none';
 });


}


//////PULSE UP STUFF///////

self.levelPulse = 0;

self.levelPulseIsClickable = false;
function  refreshLevelPulseVal(){
 self.levelPulseIsClickable = false;
 $http.get('api/v1/mapPulseByMapId/'+self.levelSelect, {headers:{auth:User.token}}).then(function(resp){
	console.log('Response from mapPulse GET');
	console.log(resp);
	self.levelPulse = resp.data;

 },function(err){
	console.log('Response from mapPulse GET Err');
	console.log(err);

 });

 $http.get('api/v1/mapPulseClickAvailable/'+self.levelSelect, {headers:{auth:User.token}}).then(function(resp){
	console.log('Response from mapPulse GET ClickAvailable');
	console.log(resp);
	  self.levelPulseIsClickable = false;

 },function(err){
	console.log('Response from mapPulse GET ClickAvailable Err');
	console.log(err);
      self.levelPulseIsClickable = true;
     
 });

  

}

self.pulseUpLevel = function(){
console.log('PulseUp Level Select');
console.log(self.levelSelect);
 $http.post('api/v1/mapPulse', {mapId: self.levelSelect}, {headers:{auth:User.token}}).then(function(resp){
	console.log('Response from mapPulse Post');
	console.log(resp);
	refreshLevelPulseVal();

 },function(err){
	console.log('Response from mapPulse Post Err');
	console.log(err);

 });

};


/////////////////////////


self.pageUp = function(){
  self.page = self.page + 1;
  getLevels();
 //initLevelChange();
  // .then(function(){
  //    initLevelChange();
  // });
};

self.pageDwn = function(){
  self.page = self.page - 1;
  if(self.page<0){
    self.page = 0;
  }
  //initLevelChange();
  getLevels();
  // .then(function(){
  //   self.levelChange();
  // });
};

self.page = 0;

self.orderByChange = function(){
  self.page = 0;
  getLevels();
};

self.orderByPulse = false;

function getLevels(){
var defered =  $q.defer();

   loadgif.style.display = 'block';

 var url = 'api/v1/maps';

  	if(self.orderByPulse){
		 url += '?page='+self.page+'&orderBy=1';
 	}else{

 		 url += '?page='+self.page;
 	}

Levels.getLevels(url).then(function(resp){

 self.levels = resp;  

                var levelFound = false;
		 var levelArrLength = self.levels.length;
		for(var i=0; i<levelArrLength; i++){
			 if(self.levelSelect ===  self.levels[i].id.toString()){
                        self.levelSelectName = self.levels[i].mapname;
                        levelFound = true;
                         console.log(self.levels[i]);
                       
                         
			 	break;
                        }


               }
                   

                if(!levelFound){
                 self.levelSelect = self.levels[0].id.toString();
                }

                player.maptree = quadtree(
                         player.levelBounds[3], 
                            player.levelBounds[0], 
                               (player.levelBounds[1]-player.levelBounds[3]), 
                               (player.levelBounds[0]-player.levelBounds[2]));

		
               defered.resolve('Done Getting LEVELS');

 },function(err){

console.log('GET LEVELS ERROR');
                console.log(err);
                    defered.reject('Token Not Valid');
 });

return defered.promise;
}


self.leaderBoardToggle = function(){
	if( self.showLeaderBoard ){
	   self.showLeaderBoard = false;
	}else{
 	   self.showLeaderBoard = true;
	 
	}
};

self.showXbitsorXnums = function(which){
	
	if(which === 0){
		self.showXbitLeaderBoard = true;
	}else{
		self.showXbitLeaderBoard = false;
	}
};




self.openLevelSelectModal = function(){
  $('#levelSelectModalPlay').modal({backdrop: 'static', keyboard: false});
$('#levelSelectModalPlay').modal('show');
Global.gameStart = false;
self.canSendMoveInputs = false;
};


self.levelChange = function(){
console.log("CHANGE LEVEL");
self.levelSelect = $('#playlevelSelect').val();
console.log(self.levelSelect);
player.level = self.levelSelect;
if(Global.animLoopHandle){
  window.cancelAnimFrame(Global.animLoopHandle);  
  Global.animLoopHandle = undefined;
}

socket.emit('changeLevel', { player: player, level: self.levelSelect});

Global.startGame = false;

    self.initScreen();

 

       //playerPos = Matrix.map([player.x, player.y, 1]);
      console.log('Player pos level CHange', player);


     //   Matrix.translate([playerPos[0], -playerPos[1], 0]);
  //Matrix.translate([Global.screenWidth/2, -Global.screenHeight/2, 0]); 
};





self.initScreen();
if(loggedin){

    User.username = loggedin.username;
    User.email = loggedin.email;
    User.id = loggedin.id;
//console.log(Global);

  //initializeGame();

   Global.gameStart = true;
       
         if (Global.animLoopHandle) {
                window.cancelAnimationFrame(Global.animLoopHandle);
                Global.animLoopHandle = undefined;
            }
        
       // Global.init();
        initializeGame();
    }else{
       getUser();
    }



}]);


}; 