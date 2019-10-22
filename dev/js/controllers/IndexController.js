require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('IndexController', ['$scope', '$window', '$state', 'Global', 'User', '$timeout', function($scope, $window, $state, Global, User, $timeout){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;


// var looptimeNow = Date.now();
// var loopdt = (looptimeNow - looplastTime)/1000;
// var looplastTime = looptimeNow;

 var runtime = 0;
 var line_animation_list = [
 {x1:0, y1:0, x2:0, y2:1},
 {x1:0, y1:1, x2:1, y2:1},
 {x1:1, y1:1, x2:1, y2:2},
 {x1:1, y1:2, x2:2, y2:2},
 {x1:0, y1:2, x2:0, y2:3},
 {x1:0, y1:3, x2:1, y2:3},
 {x1:1, y1:3, x2:1, y2:4},
 {x1:0, y1:0, x2:1, y2:0},
 {x1:1, y1:0, x2:2, y2:0},
 {x1:2, y1:0, x2:3, y2:0},
 {x1:3, y1:0, x2:4, y2:0},
 {x1:3, y1:0, x2:4, y2:0},
 {x1:0, y1:3, x2:0, y2:4},
 {x1:0, y1:4, x2:0, y2:5},
 {x1:2, y1:0, x2:2, y2:1},
 {x1:3, y1:0, x2:3, y2:1},
 {x1:3, y1:1, x2:3, y2:2},
 {x1:3, y1:2, x2:3, y2:3},
 {x1:3, y1:3, x2:3, y2:4},
 {x1:3, y1:4, x2:2, y2:4},
 {x1:3, y1:0, x2:4, y2:0},
 {x1:2, y1:2, x2:2, y2:3},
 {x1:0, y1:5, x2:1, y2:5},
 {x1:1, y1:5, x2:2, y2:5},
 {x1:2, y1:5, x2:3, y2:5},
 {x1:4, y1:0, x2:4, y2:3},
 {x1:4, y1:1, x2:5, y2:1},
 {x1:4, y1:3, x2:4, y2:4},
 {x1:4, y1:4, x2:4, y2:5},
 {x1:4, y1:5, x2:4, y2:6},
 {x1:4, y1:6, x2:3, y2:6},
 {x1:3, y1:6, x2:2, y2:6},
 {x1:2, y1:6, x2:1, y2:6},
 {x1:0, y1:5, x2:0, y2:6},
 {x1:0, y1:6, x2:0, y2:7},
 {x1:0, y1:7, x2:0, y2:8},
 {x1:1, y1:7, x2:1, y2:8},
 {x1:1, y1:7, x2:2, y2:7},
 {x1:2, y1:7, x2:3, y2:7},
 {x1:4, y1:7, x2:5, y2:7},
 {x1:4, y1:7, x2:4, y2:8},
 {x1:5, y1:7, x2:5, y2:6},
 {x1:5, y1:6, x2:5, y2:5},
 {x1:5, y1:5, x2:5, y2:4},
 {x1:6, y1:0, x2:6, y2:1},
 {x1:6, y1:1, x2:6, y2:2},
 {x1:6, y1:2, x2:5, y2:2},
 {x1:5, y1:2, x2:5, y2:3},
 {x1:5, y1:3, x2:6, y2:3},
 {x1:6, y1:3, x2:6, y2:4},	
 {x1:6, y1:4, x2:6, y2:5},
 {x1:6, y1:5, x2:6, y2:6},
 {x1:5, y1:7, x2:6, y2:7},
 {x1:6, y1:7, x2:7, y2:7},
 {x1:0, y1:8, x2:0, y2:9},
 {x1:0, y1:9, x2:1, y2:9},
 {x1:3, y1:7, x2:3, y2:8},
 {x1:3, y1:8, x2:2, y2:8},
 {x1:1, y1:9, x2:1, y2:8},

 {x1:4, y1:8, x2:4, y2:9},
 {x1:4, y1:9, x2:3, y2:9},
 {x1:3, y1:9, x2:2, y2:9},
 {x1:2, y1:9, x2:2, y2:10},
 {x1:2, y1:10, x2:2, y2:10},

 {x1:0, y1:9, x2:0, y2:10},
 {x1:0, y1:10, x2:0, y2:11},
 {x1:0, y1:11, x2:1, y2:11},
 {x1:1, y1:11, x2:2, y2:11},
 {x1:2, y1:11, x2:3, y2:11},
 {x1:3, y1:11, x2:3, y2:10},


  {x1:3, y1:10, x2:4, y2:10},
 {x1:4, y1:10, x2:5, y2:10},
 {x1:5, y1:10, x2:5, y2:9},
 {x1:5, y1:9, x2:5, y2:8},
 {x1:6, y1:7, x2:6, y2:8},
 {x1:6, y1:8, x2:6, y2:9},
 {x1:6, y1:9, x2:6, y2:10},
 {x1:6, y1:10, x2:6, y2:11},
 {x1:6, y1:11, x2:5, y2:11},
 {x1:5, y1:11, x2:4, y2:11},
 {x1:4, y1:11, x2:4, y2:12},
 {x1:4, y1:12, x2:3, y2:12},

  {x1:4, y1:12, x2:3, y2:12},
  {x1:3, y1:12, x2:2, y2:12},
  {x1:2, y1:12, x2:1, y2:12},
  {x1:0, y1:11, x2:0, y2:13},
  {x1:0, y1:13, x2:1, y2:13},


    {x1:7, y1:7, x2:7, y2:6},
    {x1:7, y1:6, x2:7, y2:5},
    {x1:7, y1:5, x2:7, y2:4},
    {x1:7, y1:4, x2:7, y2:3},
    {x1:7, y1:3, x2:7, y2:2},
    {x1:7, y1:2, x2:7, y2:1},

    {x1:6, y1:0, x2:12, y2:0},
    {x1:8, y1:0, x2:8, y2:1},
    {x1:8, y1:1, x2:9, y2:1},
    {x1:9, y1:1, x2:10, y2:1},
    {x1:11, y1:0, x2:11, y2:1},
      {x1:11, y1:1, x2:11, y2:2},

  {x1:11, y1:2, x2:10, y2:2},
  {x1:10, y1:2, x2:9, y2:2},
 
   {x1:9, y1:2, x2:8, y2:2},
   
   {x1:7, y1:3, x2:8, y2:3},
   {x1:8, y1:3, x2:9, y2:3},
   {x1:10, y1:2, x2:10, y2:3},
   {x1:10, y1:3, x2:10, y2:4},
   {x1:10, y1:4, x2:9, y2:4},
   {x1:9, y1:4, x2:8, y2:4},
    {x1:8, y1:4, x2:8, y2:5},
 {x1:8, y1:5, x2:8, y2:6},
 {x1:8, y1:6, x2:8, y2:7},

   {x1:10, y1:4, x2:10, y2:5},

  {x1:6, y1:8, x2:7, y2:8},
  {x1:7, y1:8, x2:8, y2:8},
  {x1:8, y1:8, x2:9, y2:8},
  {x1:9, y1:9, x2:9, y2:7},
  {x1:9, y1:7, x2:9, y2:6},
  {x1:9, y1:6, x2:9, y2:5},


  {x1:10, y1:5, x2:10, y2:6},
  {x1:10, y1:6, x2:10, y2:7},

    {x1:10, y1:7, x2:11, y2:7},
    {x1:11, y1:7, x2:12, y2:7},
    {x1:12, y1:7, x2:12, y2:8},
    {x1:12, y1:8, x2:12, y2:9},
    {x1:12, y1:9, x2:13, y2:9},
    {x1:13, y1:9, x2:13, y2:10},
 
    {x1:5, y1:14, x2:5, y2:12},
    {x1:5, y1:12, x2:6, y2:12},
 {x1:6, y1:12, x2:7, y2:12},
{x1:7, y1:12, x2:7, y2:11},

{x1:7, y1:11, x2:7, y2:10},
{x1:7, y1:10, x2:7, y2:9},
{x1:7, y1:9, x2:8, y2:9},
{x1:8, y1:9, x2:8, y2:10},

{x1:8, y1:10, x2:8, y2:11},

{x1:8, y1:11, x2:9, y2:11},
{x1:9, y1:11, x2:9, y2:12},
{x1:9, y1:12, x2:10, y2:12},
{x1:10, y1:12, x2:11, y2:12},

 {x1:11, y1:3, x2:11, y2:4},
{x1:11, y1:4, x2:11, y2:5},
{x1:11, y1:5, x2:11, y2:6},
{x1:11, y1:6, x2:12, y2:6},

{x1:12, y1:6, x2:13, y2:6},
{x1:13, y1:6, x2:14, y2:6},
{x1:14, y1:6, x2:14, y2:7},
{x1:14, y1:7, x2:14, y2:8},
{x1:14, y1:8, x2:15, y2:8},


{x1:15, y1:1, x2:12, y2:1},
{x1:12, y1:1, x2:12, y2:2},
{x1:12, y1:2, x2:12, y2:3},


{x1:12, y1:3, x2:12, y2:4},
{x1:12, y1:4, x2:13, y2:4},
{x1:13, y1:4, x2:14, y2:4},

{x1:14, y1:4, x2:14, y2:5},

{x1:14, y1:5, x2:15, y2:5},
{x1:15, y1:5, x2:16, y2:5},

{x1:16, y1:5, x2:16, y2:6},
{x1:16, y1:6, x2:16, y2:7}

			];


  var getRedColor = function(){
     return Math.floor((Math.random() * 255) + 1);
  };

  var getGreenColor = function(){
     return Math.floor((Math.random() * 255) + 1);
  };

  var getBlueColor = function(){
    return Math.floor((Math.random() * 255) + 1);

  };

  var getTransAmount = function(){
     return Math.random();

  };
  var square_animation_list = [
  {x:0, y:0, w:1, h:1},
  {x:0, y:1, w:1, h:1},
  {x:0, y:2, w:1, h:1},
  {x:1, y:0, w:1, h:1},
  {x:1, y:1, w:1, h:1},
  {x:1, y:3, w:1, h:1},
  {x:1, y:2, w:1, h:1},
  {x:0, y:3, w:1, h:1},
  {x:0, y:4, w:1, h:1},
  {x:2, y:0, w:1, h:1},
  {x:2, y:1, w:1, h:1},
  {x:2, y:3, w:1, h:1},
  {x:2, y:2, w:1, h:1},
  {x:3, y:0, w:1, h:1},
  {x:4, y:1, w:1, h:1},	
  {x:3, y:1, w:1, h:1},
  {x:4, y:0, w:1, h:1},
  {x:2, y:4, w:1, h:1},  
  {x:3, y:2, w:1, h:1},
  {x:3, y:3, w:1, h:1},
  {x:1, y:4, w:1, h:1},
  {x:0, y:5, w:1, h:1},
  {x:3, y:4, w:1, h:1},
  {x:3, y:5, w:1, h:1},	
  {x:2, y:5, w:1, h:1},  
  {x:1, y:5, w:1, h:1},  
  {x:0, y:6, w:1, h:1},
  {x:0, y:7, w:1, h:1},
  {x:1, y:6, w:1, h:1},
  {x:1, y:7, w:1, h:1},
  {x:2, y:6, w:1, h:1},
  {x:3, y:6, w:1, h:1},
  {x:4, y:6, w:1, h:1},
  {x:4, y:5, w:1, h:1},	
  {x:4, y:4, w:1, h:1}, 
  {x:4, y:3, w:1, h:1}, 
  {x:4, y:2, w:1, h:1}, 
  {x:0, y:8, w:1, h:1},
  {x:0, y:9, w:1, h:1},
  {x:5, y:0, w:1, h:1},	
  {x:5, y:1, w:1, h:1},
  {x:2, y:7, w:1, h:1},
  {x:3, y:7, w:1, h:1},
  {x:4, y:7, w:1, h:1},
  {x:1, y:8, w:1, h:1},
  {x:5, y:3, w:1, h:1},
  {x:5, y:4, w:1, h:1},
  {x:5, y:5, w:1, h:1},
  {x:5, y:6, w:1, h:1},
  {x:6, y:6, w:1, h:1},
  {x:0, y:10, w:1, h:1},

  {x:3, y:8, w:1, h:1},
  {x:2, y:8, w:1, h:1},
  {x:1, y:9, w:1, h:1},
  {x:1, y:10, w:1, h:1},
  {x:2, y:10, w:1, h:1},
  {x:2, y:9, w:1, h:1},
  {x:3, y:9, w:1, h:1},

 {x:3, y:10, w:1, h:1},
 {x:4, y:10, w:1, h:1},
 {x:4, y:9, w:1, h:1},
 {x:4, y:8, w:1, h:1},
 {x:5, y:8, w:1, h:1},
 {x:5, y:7, w:1, h:1},
 {x:5, y:9, w:1, h:1},
 {x:5, y:10, w:1, h:1},

  {x:6, y:7, w:1, h:1},

    {x:6, y:5, w:1, h:1},
  {x:6, y:4, w:1, h:1},
  {x:6, y:3, w:1, h:1},
  {x:6, y:2, w:1, h:1},
  {x:5, y:2, w:1, h:1},
  {x:6, y:1, w:1, h:1},
  {x:6, y:0, w:1, h:1},
  {x:7, y:0, w:1, h:1},
  {x:8, y:0, w:1, h:1},
  {x:9, y:0, w:1, h:1},
  {x:10, y:0, w:1, h:1},
   {x:11, y:0, w:1, h:1},
  {x:12, y:0, w:1, h:1},
  {x:13, y:0, w:1, h:1},
  {x:14, y:0, w:1, h:1},

    {x:11, y:1, w:1, h:1},
    {x:10, y:1, w:1, h:1},
    {x:9, y:1, w:1, h:1},
    {x:8, y:1, w:1, h:1},
  {x:7, y:1, w:1, h:1},
  {x:7, y:2, w:1, h:1},

    {x:3, y:11, w:1, h:1},
  {x:2, y:11, w:1, h:1},
  {x:1, y:11, w:1, h:1},
  {x:0, y:11, w:1, h:1},
  {x:0, y:12, w:1, h:1},
  {x:1, y:12, w:1, h:1},
  {x:2, y:12, w:1, h:1},
  {x:3, y:12, w:1, h:1},
  {x:4, y:12, w:1, h:1},
  {x:4, y:11, w:1, h:1},
   {x:4, y:12, w:1, h:1},

 {x:8, y:2, w:1, h:1},
 {x:9, y:2, w:1, h:1},

 {x:9, y:3, w:1, h:1},
 {x:8, y:3, w:1, h:1},
 {x:7, y:3, w:1, h:1},
 {x:7, y:4, w:1, h:1},
 {x:7, y:5, w:1, h:1},

 {x:7, y:6, w:1, h:1},
 {x:7, y:7, w:1, h:1},

  {x:6, y:8, w:1, h:1},
 {x:6, y:9, w:1, h:1},
 {x:6, y:10, w:1, h:1},
 {x:6, y:11, w:1, h:1},
 {x:6, y:12, w:1, h:1},
 {x:5, y:11, w:1, h:1},
 {x:5, y:12, w:1, h:1},
 {x:0, y:13, w:1, h:1},
 {x:2, y:13, w:1, h:1},
 {x:1, y:14, w:1, h:1},
 {x:3, y:14, w:1, h:1},
 {x:4, y:13, w:1, h:1},
 {x:5, y:15, w:1, h:1},

  {x:8, y:7, w:1, h:1},
 {x:8, y:6, w:1, h:1},
 {x:8, y:5, w:1, h:1},
 {x:8, y:4, w:1, h:1},
 {x:9, y:4, w:1, h:1},
 {x:9, y:5, w:1, h:1},
 {x:9, y:6, w:1, h:1},
 {x:9, y:7, w:1, h:1},
 {x:9, y:8, w:1, h:1},
 {x:9, y:9, w:1, h:1},
 {x:8, y:9, w:1, h:1},
 {x:7, y:9, w:1, h:1},
 {x:7, y:8, w:1, h:1},
 {x:8, y:8, w:1, h:1},

{x:10, y:2, w:1, h:1},
{x:10, y:3, w:1, h:1},
{x:10, y:4, w:1, h:1},
{x:10, y:5, w:1, h:1},
{x:10, y:6, w:1, h:1},

{x:11, y:6, w:1, h:1},
{x:12, y:6, w:1, h:1},

{x:15, y:0, w:1, h:1},
{x:16, y:0, w:1, h:1},
{x:17, y:0, w:1, h:1},
{x:18, y:0, w:1, h:1},

{x:12, y:1, w:1, h:1},
{x:13, y:1, w:1, h:1},
{x:14, y:1, w:1, h:1},
{x:13, y:1, w:1, h:1},

{x:12, y:2, w:1, h:1},
{x:12, y:3, w:1, h:1},	
{x:13, y:3, w:1, h:1},
{x:14, y:3, w:1, h:1},
{x:14, y:4, w:1, h:1},	
{x:14, y:5, w:1, h:1},

{x:6, y:13, w:1, h:1},
{x:8, y:15, w:1, h:1},
{x:7, y:14, w:1, h:1},
{x:10, y:5, w:1, h:1},
{x:15, y:5, w:1, h:1},

{x:15, y:9, w:1, h:1},
{x:16, y:10, w:1, h:1},
{x:17, y:11, w:1, h:1},
{x:15, y:8, w:1, h:1},

{x:12, y:5, w:1, h:1},

{x:11, y:8, w:1, h:1},

{x:13, y:9, w:1, h:1},

{x:16, y:2, w:1, h:1},

{x:16, y:4, w:1, h:1},	
];


var rand_color_r = getRedColor();

var rand_color_g = getGreenColor();
var rand_color_b = getBlueColor();
var rand_trans = getTransAmount();

//var calclNewColors = true;

function animation(){
     
	//looptimeNow = Date.now();
	//loopdt = (looptimeNow - looplastTime)/1000;
	//looplastTime = looptimeNow;
	runtime = runtime + 0.2;

	var w = self.c.width;
	var h = self.c.height;
        
      




       var index = Math.round(runtime*15);
	     var indexLines = index;
	     var indexBoxes = index;

       if(indexLines >= line_animation_list.length){
		indexLines = line_animation_list.length;
        }
       if(indexBoxes >= square_animation_list.length){
		       indexBoxes = square_animation_list.length;
         //  calclNewColors = false;
        }
      
      var increment = Global.screen_min_dim()/10;
    for(var i=0; i<indexBoxes; i++){
        
       // if(calclNewColors){
		 if(!!square_animation_list[i].color){
			self.ctx.fillStyle = square_animation_list[i].color;
         		

                }else{
			  rand_color_r = getRedColor();
         		 rand_color_g = getGreenColor();
          		 rand_color_b = getBlueColor();
         		 rand_trans = getTransAmount();
			 square_animation_list[i].color = 'rgba('+rand_color_r+','+rand_color_g+','+rand_color_b+','+rand_trans+')';
			 self.ctx.fillStyle = 'rgba('+rand_color_r+','+rand_color_g+','+rand_color_b+','+rand_trans+')';    
	         }

               //   self.ctx.fillStyle = 'rgba('+rand_color_r+','+rand_color_g+','+rand_color_b+','+rand_trans+')';

           
        //}else{
        //   self.ctx.fillStyle = square_animation_list[i].color;
        //}
          
         
             
         
       
        	 self.ctx.fillRect(square_animation_list[i].x*increment,
				 square_animation_list[i].y*increment, 
					square_animation_list[i].w*increment,
						 square_animation_list[i].h*increment);
 
		 self.ctx.stroke();

 		 self.ctx.closePath();

		//self.ctx.font = "10px Arial";
		//var text = "("+ square_animation_list[i].x + ", " + square_animation_list[i].y + ")";
		//self.ctx.fillStyle = "#ffffff";
		//self.ctx.fillText(text,square_animation_list[i].x*increment+5,square_animation_list[i].y*increment+10);
	
	}
	for(var i=0; i<indexLines; i++){
         
	  
		
	
	  	self.ctx.beginPath();
         	self.ctx.setLineDash([1,0]);
    	  	self.ctx.strokeStyle = 'rgba(0,0,0,1.0)';
         	self.ctx.lineWidth = 5;
         	self.ctx.lineCap = "round";


         	var start = [];
         	var end = [];

         	start[0] = increment * line_animation_list[i].x1;
	 	 start[1] = increment * line_animation_list[i].y1;
         
         	end[0] = increment * line_animation_list[i].x2;
	  	end[1] = increment * line_animation_list[i].y2;

         	self.ctx.moveTo(start[0], start[1]);
         	self.ctx.lineTo(end[0], end[1]);
              
            self.ctx.stroke();
	 }
		
      

          var dirX = w*Math.cos(runtime*0.3);
	var dirY = h*Math.sin(runtime*0.3);
	
	var grd = self.ctx.createLinearGradient(0,0,dirX,dirY);
 	grd.addColorStop(0,"rgba(255,12,19,0.4)");
 	grd.addColorStop(1,"rgba(0,12,19,0.6)");

 	// Fill with gradient
 	self.ctx.fillStyle=grd;
 	self.ctx.fillRect(0,0,w,h);
}



var cancelRefresh;
self.drawStuff = function() {
    cancelRefresh = $timeout(function myFunction() {
        animation();
        cancelRefresh = $timeout(self.drawStuff, 1000/20);
    },1000/20);
};

$scope.$on('$destroy', function(e) {
        $timeout.cancel(cancelRefresh);
});

self.initScreen = function(){
$('.footer-container').css(
		{'position': 'fixed',
			'bottom': 0,
			'left': 0,
			'background-color': 'transparent'
		});

self.c = document.getElementById("homeCanvas");
self.c.width = Global.screenWidth;
self.c.height = Global.screenHeight;

	try {
		$timeout.cancel(cancelRefresh);
	}catch(e){
	}

self.ctx = self.c.getContext("2d");
self.drawStuff();

};


angular.element($window).bind('resize', function(){
  //Any time you attach event to $window with angular it becomes application wide Thus.. if state..
    if($state.is('index')){
  Global.updateScreenDims();
    self.initScreen();
  }
});


self.initScreen();




   
}]);


}; 