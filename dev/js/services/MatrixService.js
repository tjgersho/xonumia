require('angular');

module.exports.service = function(){
'use strict';
angular.module('Services').factory('Matrix', 
	[function(){
    //console.log("XonumiaController");
var service = this;

service.m = [[1,0,0], [0,1,0],[0,0,1]];

service.invm = [[],[],[]];


service.reset = function(){
    service.m = [[1,0,0], [0,1,0],[0,0,1]];
};

//console.log(service.m);

service.scale = function(s){
    //console.log("SCALE");
   // console.log(s);
service.m[0][0] =  service.m[0][0]*s[0];
service.m[1][1] =  service.m[1][1]*s[1];
service.m[2][2] =  service.m[2][2]*s[2];

};

service.translate = function(t){
  //  console.log("TRANS");

service.m[0][2] = service.m[0][2] + t[0];
service.m[1][2] =  service.m[1][2]+ t[1];
service.m[2][2] =  service.m[2][2]+ t[2];

};

service.rotate = function(theta){
service.m[0][0] = service.m[0][0] * Math.cos(theta) + service.m[0][1]*Math.sin(theta);
service.m[0][1] =  service.m[0][0]* -Math.sin(theta) + service.m[0][1]*Math.cos(thea);
service.m[0][2] =  service.m[0][2];


service.m[1][0] = service.m[1][0] * Math.cos(theta) + service.m[1][1]*Math.sin(theta);
service.m[1][1] =  service.m[1][0]* -Math.sin(theta) + service.m[1][1]*Math.cos(thea);
service.m[1][2] =  service.m[1][2];


service.m[2][0] = service.m[2][0] * Math.cos(theta) + service.m[2][1]*Math.sin(theta);
service.m[2][1] =  service.m[2][0]* -Math.sin(theta) + service.m[2][1]*Math.cos(thea);
service.m[2][2] =  service.m[2][2];

};


service.map = function(src){ ////maps Game Coords to screen Coords..
 // console.log("MAP");
 // console.log(service.m);
 // console.log(src);
var screen = [];

screen[0] = src[0]*service.m[0][0] + src[1]*service.m[0][1] + src[2]*service.m[0][2];
screen[1] = src[0]*service.m[1][0] + src[1]*service.m[1][1] + src[2]*service.m[1][2];
screen[2] = src[0]*service.m[2][0] + src[1]*service.m[2][1] + src[2]*service.m[2][2];
//console.log(src);
return screen;
};

service.inverseMap = function(screen){   ////maps screen coords to game coords...
service.invertM();
var src = [];
src[0] = screen[0]*service.invm[0][0] + screen[1]*service.invm[0][1] + screen[2]*service.invm[0][2];
src[1] = screen[0]*service.invm[1][0] + screen[1]*service.invm[1][1] + screen[2]*service.invm[1][2];
src[2] = screen[0]*service.invm[2][0] + screen[1]*service.invm[2][1] + screen[2]*service.invm[2][2];

return src;
};



service.invertM = function(){
var detM = service.m[0][0]*service.m[1][1]*service.m[2][2]+
			service.m[0][1]*service.m[1][2]*service.m[2][0]+
				service.m[0][2]*service.m[1][0]*service.m[2][1]-
					service.m[0][2]*service.m[1][1]*service.m[2][0]-
						service.m[0][1]*service.m[1][0]*service.m[2][2]-
							service.m[0][0]*service.m[1][2]*service.m[2][1];

if(detM !== 0){

service.invm[0][0] = 1/detM * (service.m[1][1]*service.m[2][2] - service.m[1][2]*service.m[2][1]);
service.invm[0][1] = 1/detM * (service.m[0][2]*service.m[2][1] - service.m[0][1]*service.m[2][2]);
 service.invm[0][2] = 1/detM * (service.m[0][1]*service.m[1][2] - service.m[0][2]*service.m[1][1]);

  service.invm[1][0] = 1/detM * (service.m[1][2]*service.m[1][0] - service.m[1][0]*service.m[2][2]);
   service.invm[1][1] = 1/detM * (service.m[0][0]*service.m[2][2] - service.m[0][2]*service.m[2][0]);
    service.invm[1][2] = 1/detM * (service.m[0][2]*service.m[1][0] - service.m[0][0]*service.m[1][2]);

  service.invm[2][0] = 1/detM * (service.m[1][0]*service.m[2][1] - service.m[1][1]*service.m[2][0]);
   service.invm[2][1] = 1/detM * (service.m[0][1]*service.m[2][0] - service.m[0][0]*service.m[2][1]);
    service.invm[2][2] = 1/detM * (service.m[0][0]*service.m[1][1] - service.m[0][1]*service.m[1][0]);
}else{

	console.log("IVERSE FAILED");


}

};


return service;
}]);


}; 