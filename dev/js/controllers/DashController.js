require('angular');
require('angular-ui-router');
var $ = require('jquery');

require('../../libs/spectrum.js');


import 'bootstrap/dist/js/bootstrap';


module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('DashController',  ['$scope', '$http', 'User', 'Global', '$state', '$window', '$timeout', function($scope, $http, User, Global, $state, $window, $timeout){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;

console.log('USER DATA IN DASH CONTROLLER');
	console.log(User);
	console.log($state);

self.user = User;

self.user.numberOfXnum();
self.user.valueOfXnum();
self.user.availableValueOfXnum();

self.showLeaderBoard = false;
self.showXbitLeaderBoard = false;

self.leaderboardXbits = [];
self.leaderboardXnums = [];

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

self.getLeaderBoardArrays = function(){
$http.get('api/v1/leaderboard', {headers:{auth: self.user.token}}).then(function(resp){
	console.log('Dashboard LeaderBoard');
	console.log(resp);
self.leaderboardXbits = resp.data.xbitLeaderboard;
self.leaderboardXnums = resp.data.xnumLeaderboard;

},function(err){
	console.log('Err Getting DashBoard LeaderBoard');
	console.log(err);
});

};


var cancelRefresh;
self.refreshStuff = function() {
    cancelRefresh = $timeout(function myFunction() {
      			 self.getLeaderBoardArrays();
       		 cancelRefresh = $timeout(self.refreshStuff , 10000);
    	}, 10000);
};


$scope.$on('$destroy', function(e) {
		console.log("YESSS ANIMATION DESTROYED !! NO MEMORY LEAD HOPEFULLY");
     		  $timeout.cancel(cancelRefresh);
});

self.refreshStuff();
self.getLeaderBoardArrays();

self.showRequestPaymentModal = function(){
$('#RequestXnumPaymentModal').modal({backdrop: 'static', keyboard: false});
   $('#RequestXnumPaymentModal').modal('show');
}

self.sendRequest = function(){

  $('#RequestXnumPaymentModal').modal('hide');

 $('#mapEndModal').on('hidden.bs.modal', function () { });

}



var cplayer = document.getElementById("customizeColors");
var ctxPlayer = cplayer.getContext("2d");
var cxnum = document.getElementById("xnumDrawCanvas");
var ctxXnum =  cxnum.getContext("2d");
var cxbit = document.getElementById("xbitDrawCanvas");
var ctxXbit = cxbit.getContext("2d");



console.log('Canvas Size');
console.log(cplayer.width);
console.log(cplayer.height);

$http.get('/api/v1/userxnum', {headers:{auth: User.token}}).then(function(resp){
	   console.log('Get Xnums');
	   console.log(resp);
	   self.user.xnums = resp.data;
    },function(err){
     console.log('Get Xnums Err');
      console.log(err);
     });



self.updateUserColors = function(){
var colorData = {'bodyColorR': self.bodyColorR,
		  'bodyColorG': self.bodyColorG,
		  'bodyColorB': self.bodyColorB,
		  'bodyColorA': self.bodyColorA,
		  'borderColorR': self.borderColorR,
		  'borderColorG': self.borderColorG,
		  'borderColorB': self.borderColorB,
		  'borderColorA': self.borderColorA};

    
    User.updateColor(colorData).then(function(resp){
	   
           console.log('Update Color Resp');
	    console.log(resp);
	   
    },function(err){
           console.log('Update Color Err');
           console.log(err); 

     });

};



$("#colorPickerBody").spectrum({
    showAlpha: true,
    change: function(tinycolor) { 
   

       self.bodyColorR = parseInt(tinycolor._r);
        self.bodyColorG = parseInt(tinycolor._g);
          self.bodyColorB = parseInt(tinycolor._b);
            self.bodyColorA = tinycolor._a;
console.log('ALPHA BOdy');
	console.log(self.bodyColorA);
		self.updateUserColors();
         self.drawPlayerPreview(ctxPlayer, cplayer.width, cplayer.height);
    }
});

var bodyString = 'rgba('+User.bodyColorR+ ',' +
			    User.bodyColorG+ ',' + 
				User.bodyColorB+ ',' + 
				User.bodyColorA+ ')';

$("#colorPickerBody").spectrum("set", bodyString);

$("#colorPickerBorder").spectrum({
    showAlpha: true,
    change: function(tinycolor) { 
     
     
      self.borderColorR = parseInt(tinycolor._r);
       self.borderColorG = parseInt(tinycolor._g);
         self.borderColorB = parseInt(tinycolor._b);
           self.borderColorA = tinycolor._a;
	console.log('ALPHA');
	console.log(self.borderColorA);
              self.updateUserColors();
          self.drawPlayerPreview(ctxPlayer, cplayer.width, cplayer.height);
    }
});

var borderString = 'rgba('+User.borderColorR + ',' +
			    User.borderColorG + ',' + 
				User.borderColorB + ',' + 
				User.borderColorA + ')';

$("#colorPickerBorder").spectrum("set",  borderString);


self.borderColorR = User.borderColorR; 
self.borderColorG = User.borderColorG;
self.borderColorB = User.borderColorB;
self.borderColorA = User.borderColorA;

self.bodyColorR = User.bodyColorR;
self.bodyColorG = User.bodyColorG;
self.bodyColorB = User.bodyColorB;
self.bodyColorA = User.bodyColorA;



self.logout = function() {
 
    User.logout(User.token);
    $state.go('login');

};


function drawCircle(graph, centerX, centerY, radius, sides) {
    var theta = 0;
    var x = 0;
    var y = 0;
    var xpoints = [[]];

    graph.beginPath();

    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI+Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
          var moveTo = [x, y, 1];
                  
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


self.drawPlayerPreview = function(ctx, w, h) {

              var x=0;
              var y=0;
	
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);



              ctx.strokeStyle = 'rgba(' + self.borderColorR + 
					','+ self.borderColorG +
					','+ self.borderColorB +
					','+ self.borderColorA + ')';

              ctx.fillStyle = 'rgba(' + self.bodyColorR + 
					','+ self.bodyColorG +
					','+ self.bodyColorB +
					','+ self.bodyColorA + ')';
              ctx.lineWidth = 5;

              var xstore = [];
              var ystore = [];

              Global.spin += 0.0;
            
		
              var points = 10 + ~~((20)/5);
              var increase = Math.PI * 2 / points;
                      
              for (var i = 0; i < points; i++) {

                  x = (w/2-5) * Math.cos(Global.spin)+w/2;
                  y = (h/2-5) * Math.sin(Global.spin)+h/2;
                
                  Global.spin += increase;
                  xstore[i] = x;
                  ystore[i] = y;
              }

	
              for (i = 0; i < points; ++i) {
                  if (i === 0) {
                      ctx.beginPath();
                      ctx.moveTo(xstore[i],  ystore[i]);

                  } else if (i > 0 && i < points - 1) {
                     ctx.lineTo(xstore[i], ystore[i]);

                  } else {
                      ctx.lineTo(xstore[i], ystore[i]);
                      ctx.lineTo(xstore[0], ystore[0]);

                  }
              }

             ctx.lineJoin = 'round';
             ctx.lineCap = 'round';
              ctx.fill();
              ctx.stroke();

	};



self.drawXnum = function(graph) {

    graph.strokeStyle = 'rgba(255,0,0,1.0)';
    graph.fillStyle = 'rgba(0,0,0,1.0)';
    graph.lineWidth = 3;
         graph.lineJoin = 'round';
     graph.lineCap = 'round';
   var xpoints =  drawCircle(graph, 40, 40, 35, 25);
  

   var xoPointsMapped = [
			[40+18, 40+18],
			[40-18, 40-18],
			[40-18, 40+18],
			[40+18, 40-18]
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


};




self.drawXbit = function(graph){

 
    graph.strokeStyle = 'rgba(0,0,0,1.0)';
          graph.lineJoin = 'round';
     graph.lineCap = 'round';

     var r = Math.floor((Math.random() * 255) + 1);
     var g = Math.floor((Math.random() * 255) + 1);
     var b = Math.floor((Math.random() * 255) + 1);
     var a = Math.random();
    graph.fillStyle = 'rgba('+r+','+g+','+b+','+a+')'; /// Random color...
   
   graph.lineWidth = 2;
  var xpoints =  drawCircle(graph, 40, 40, 20, 7);

   var xoPointsMapped = [
			 [40+7, 40+7],
			[40-7, 40-7],
			[40-7, 40+7],
			[40+7, 40-7]
		];


  graph.beginPath();
  graph.lineWidth = 5;
  graph.moveTo(xoPointsMapped[0][0], xoPointsMapped[0][1]);
  graph.lineTo(xoPointsMapped[1][0], xoPointsMapped[1][1]);
  graph.moveTo(xoPointsMapped[2][0], xoPointsMapped[2][1]);
  graph.lineTo(xoPointsMapped[3][0], xoPointsMapped[3][1]);
  graph.stroke();
  
};




self.userConqurings = {};

$http.get('api/v1/conquringsByUser', {headers:{auth: User.token}}).then(function(resp){
	   console.log('Get Concuring');
	   console.log(resp);
	   self.userConqurings = resp.data;
    },function(err){
     console.log('Get Xnums Err');
      console.log(err);
});



self.userAdvertisements = {};

$http.get('api/v1/userAdv', {headers:{auth: User.token}}).then(function(resp){
	   console.log('Get UserAdvs');
	   console.log(resp);
	   self.userAdvertisements = resp.data;
    },function(err){
     console.log('Get UserAdvs Err');
      console.log(err);
});






self.initScreen = function(){


};

self.drawPlayerPreview(ctxPlayer, cplayer.width, cplayer.height);
self.drawXnum(ctxXnum);
self.drawXbit(ctxXbit);


angular.element($window).bind('resize', function(){
  //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('dashboard')){
  Global.updateScreenDims();
    self.initScreen();
  }
});


   
}]);


		

}; 