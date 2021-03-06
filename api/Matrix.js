//Matrix class for transformations

class Matrix{
	
constructor(){
	this.m = [
			  [1,0,0], 
			  [0,1,0],
			  [0,0,1]
			  		];

	this.invm = [[],[],[]];
}

reset(){
	this.m = [
			  [1,0,0], 
			  [0,1,0],
			  [0,0,1]
			  		];
}


scale(s){
    //console.log("SCALE");
   // console.log(s);
this.m[0][0] =  this.m[0][0]*s[0];
this.m[1][1] =  this.m[1][1]*s[1];
this.m[2][2] =  this.m[2][2]*s[2];

}


translate(t){
  //  console.log("TRANS");

this.m[0][2] = this.m[0][2] + t[0];
this.m[1][2] =  this.m[1][2]+ t[1];
this.m[2][2] =  this.m[2][2]+ t[2];

}

rotate(theta){
this.m[0][0] = this.m[0][0] * Math.cos(theta) + this.m[0][1]*Math.sin(theta);
this.m[0][1] =  this.m[0][0]* -Math.sin(theta) + this.m[0][1]*Math.cos(thea);
this.m[0][2] =  this.m[0][2];


this.m[1][0] = this.m[1][0] * Math.cos(theta) + this.m[1][1]*Math.sin(theta);
this.m[1][1] =  this.m[1][0]* -Math.sin(theta) + this.m[1][1]*Math.cos(thea);
this.m[1][2] =  this.m[1][2];


this.m[2][0] = this.m[2][0] * Math.cos(theta) + this.m[2][1]*Math.sin(theta);
this.m[2][1] =  this.m[2][0]* -Math.sin(theta) + this.m[2][1]*Math.cos(thea);
this.m[2][2] =  this.m[2][2];

}


map(src){ ////maps Game Coords to screen Coords..
 // console.log("MAP");
 // console.log(this.m);
 // console.log(src);
var screen = [];

screen[0] = src[0]*this.m[0][0] + src[1]*this.m[0][1] + src[2]*this.m[0][2];
screen[1] = src[0]*this.m[1][0] + src[1]*this.m[1][1] + src[2]*this.m[1][2];
screen[2] = src[0]*this.m[2][0] + src[1]*this.m[2][1] + src[2]*this.m[2][2];
//console.log(src);
return screen;
}


inverseMap(screen){   ////maps screen coords to game coords...
this.invertM();
var src = [];
src[0] = screen[0]*this.invm[0][0] + screen[1]*this.invm[0][1] + screen[2]*this.invm[0][2];
src[1] = screen[0]*this.invm[1][0] + screen[1]*this.invm[1][1] + screen[2]*this.invm[1][2];
src[2] = screen[0]*this.invm[2][0] + screen[1]*this.invm[2][1] + screen[2]*this.invm[2][2];

return src;
}


invertM(){
var detM = this.m[0][0]*this.m[1][1]*this.m[2][2] +
			this.m[0][1]*this.m[1][2]*this.m[2][0] +
				this.m[0][2]*this.m[1][0]*this.m[2][1] -
					this.m[0][2]*this.m[1][1]*this.m[2][0] -
						this.m[0][1]*this.m[1][0]*this.m[2][2] -
							this.m[0][0]*this.m[1][2]*this.m[2][1];

if(detM !== 0){

this.invm[0][0] = 1/detM * (this.m[1][1]*this.m[2][2] - this.m[1][2]*this.m[2][1]);
this.invm[0][1] = 1/detM * (this.m[0][2]*this.m[2][1] - this.m[0][1]*this.m[2][2]);
 this.invm[0][2] = 1/detM * (this.m[0][1]*this.m[1][2] - this.m[0][2]*this.m[1][1]);

  this.invm[1][0] = 1/detM * (this.m[1][2]*this.m[1][0] - this.m[1][0]*this.m[2][2]);
   this.invm[1][1] = 1/detM * (this.m[0][0]*this.m[2][2] - this.m[0][2]*this.m[2][0]);
    this.invm[1][2] = 1/detM * (this.m[0][2]*this.m[1][0] - this.m[0][0]*this.m[1][2]);

  this.invm[2][0] = 1/detM * (this.m[1][0]*this.m[2][1] - this.m[1][1]*this.m[2][0]);
   this.invm[2][1] = 1/detM * (this.m[0][1]*this.m[2][0] - this.m[0][0]*this.m[2][1]);
    this.invm[2][2] = 1/detM * (this.m[0][0]*this.m[1][1] - this.m[0][1]*this.m[1][0]);
}else{

	console.log("IVERSE FAILED");


}

}



}



module.exports = Matrix;






