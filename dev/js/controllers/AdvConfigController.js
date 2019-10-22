require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('AdvConfigController', ['$scope', '$state', '$http', 'Global', 'Cart', 'User', '$timeout', 
		function($scope, $state, $http, Global, Cart, User, $timeout){
   
var self = this;
self.cart = Cart;

if(self.cart.adv.advId > 0){

	self.imageUploaded = false;
       self.fitimagePreview = new Image;
       self.fitimagePreview.src = 'public/advImages/sponsorshipavailable.png';

        self.fitimagePreview.onload = function(){
		console.log('Natrual Height and Width');
		console.log(self.fitimagePreview.naturalWidth);
		console.log(self.fitimagePreview.naturalHeight);
		self.imageRatio = self.fitimagePreview.naturalWidth/self.fitimagePreview.naturalHeight;
		
		self.drawFitImage();
	   };

	self.aspectSelect = function(type){
		self.cart.adv.aspect = type;
		
		self.drawFitImage();

	};
	self.drawDashedLines = function(ctx){
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
  		ctx.closePath();

	};

	self.drawImage = function(ctx, w, h){
		if(self.fitimagePreview.src === 'public/advImages/sponsorshipavailable.png'){
    		 var cirx = (w) / 2;
     		 var ciry = (h) / 2;

     	        var r2 = Math.max(w, h);
   
     		 var grd = ctx.createRadialGradient(cirx, ciry, 2, cirx, ciry, r2/2);
     		 grd.addColorStop(0, '#8ED6FF');
     		 grd.addColorStop(1, '#004CB3');

     		 ctx.fillStyle = grd;
     		 ctx.fillRect(-2, -2, w+2, h+2);
    		
		}

		var adRatio = (w/h);
		switch (self.cart.adv.aspect){
		  case 0: //Stretch
			 ctx.drawImage(self.fitimagePreview, -2, -2, w+2, h+2); 
		break;
		  case 1: //Fit
	
			if(adRatio <=  self.imageRatio){ //Flat
				var dy = (h - w/self.imageRatio)/2;
     			 	ctx.drawImage(self.fitimagePreview, -2, dy, w+2, h-2*dy+2); 
                     }else{ // Tall
				var dx = (w - h*self.imageRatio)/2;
     			 	ctx.drawImage(self.fitimagePreview, dx, -2, w-2*dx+2, h+2); 
                     }
		 	

		break;
		  case 2: //Fill

 
			if(adRatio <=  self.imageRatio){  //Flat
				var dx = (h*self.imageRatio - w)/2;
				console.log('w',w);
				console.log(dx);
     			 	ctx.drawImage(self.fitimagePreview, -dx-2, -2, w+2*dx+2, h+2); 
                     }else{  //Tall
				var dy = (w/self.imageRatio-h)/2;
				console.log('h',h);
				console.log(dy);
     			 	ctx.drawImage(self.fitimagePreview, -2, -dy-2, w+2, h+2*dy+2); 
                     }

		break;
		  default:
			 ctx.drawImage(self.fitimagePreview, -2, -2, w+2, h+2); 

		}
		
     		     
     

	};

	self.drawFitImage = function(){
		console.log("DRAW SPONSORSHIP SPOT");

		var canvas = document.getElementById("advFitPreview");
		var width = 200;
		var height = (self.cart.adv.height/self.cart.adv.width)*width;
		canvas.width = width;
		canvas.height = height;

              var ctx = canvas.getContext("2d");


		//self.drawDashedLines(ctx);
  
              self.drawImage(ctx, width, height);

	};	


       var loader = $('#loader');
	
	
	self.uploadProgress = 0;
	self.uploading = false;

	self.uploadProgressStyle = function(){
		return {'width' : self.uploadProgress + '%'};
	};
    
	self.linkInput=false;
	$('#advLink').blur();
	self.showHideInputLink = function(){
		if(self.linkInput){
			self.linkInput=false;
			self.cart.adv.link = '';
			$('#advLink').blur();

		}else{
			self.linkInput=true;
			$('#advLink').blur();
		}
	};
   
	self.validateLink = function(){
          self.cart.adv.link = self.cart.adv.link.trim();
          var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
           var is_validLink = false;
	   is_validLink = regex.test(self.cart.adv.link);
	     if(is_validLink){
		self.cart.adv.hasLink = true;
	     }else{
		self.cart.adv.hasLink = false;
	     } 
	   return is_validLink;        
	};

	self.uploadFileToUrl = function(file, uploadUrl){
              console.log('UPLOAD URL');
              console.log(uploadUrl);
		var fd = new FormData();
		console.log('Files');
		console.log(file.files);
		fd.append('file', file.files[0]);
		fd.append('advId', self.cart.adv.advId);
		
		console.log(fd);

		self.uploadProgress = 0;

		var uploadAdvXhrCallConfig = {
			      method : 'POST',
			      url: uploadUrl,
			                //params: null,
			      data: fd,
			      headers: {'Content-Type': undefined, auth: User.token},
			      eventHandlers: {
			      readystatechange: function(event) {
			                        if(event.currentTarget.readyState === 4) {
			                            console.log("readyState=4: Server has finished extra work!");
			                        }
			             }
			    	},
				 uploadEventHandlers: {
						progress: function(e) {
							if (e.lengthComputable) {
							    self.uploadProgress = Math.round(e.loaded * 100 / e.total);
							     console.log("progress: " + self.uploadProgress + "%");
							    if (e.loaded === e.total) {
							        console.log("File upload finished!");
							        console.log("Server will perform extra work now...");
							           }
							       }
							}
					},
			                //xsrfHeaderName: '',
			                //xsrfCookieName: '',
			                transformRequest: angular.identity, //function(data, headersGetter) {},
			                //tranformResponse: function(data, headersGetter, status){},
			                //paramSerializer: '',
			                //cache: false,
			                //timeout: null,
			                //withCredentials: false,
			                responseType: "json"
			            };

			        




			 $http(uploadAdvXhrCallConfig).then(function(resp){

					var uploadedImag = resp.data.img;
                                   var ext = uploadedImag.substr(uploadedImag.lastIndexOf('.'));

					
                                   var basename = uploadedImag.substr(0,uploadedImag.lastIndexOf('.'));
                                   var dateObj = new Date();
					
                                   self.previewImageSrc = 'public/advImages/' + self.cart.adv.advId + '/'+ basename + "_M" +  ext;
                                   self.fitimagePreviewSrc  = 'public/advImages/' + self.cart.adv.advId + '/'+ basename + "_L" +  ext;

					console.log(self.previewImageSrc);
 
					loader.hide();
					
                                   document.getElementById("file"+self.cart.adv.advId).value = "";

                                   self.setAdvImageUploadPreview();
					self.uploading = false;
					self.imageUploaded = true;
					self.drawFitImage();

			 }, function(err){
			 	console.log('Image Upload Error');
			 	console.log(err);
			       loader.hide(); 
			       self.uploading = false;

			 });




			};

			var loader = $('#loader');

		  self.uploadAdvImg = function(){
			
			loader.show();
			self.uploading = true;
			var file =  document.getElementById("file"+self.cart.adv.advId);
			var url = '/api/v1/adv/'+self.cart.adv.advId;
			console.log(url, file);
			self.uploadFileToUrl(file, url);

		   };
        
	   
	self.previewImageSrc = 'public/advImages/sponsorshipavailable.png';
	self.fitimagePreviewSrc = 'public/advImages/sponsorshipavailable.png';
 
	

      self.setAdvImageUploadPreview = function(){
       
      
          var advImageUploadPreview = new Image;
	   

          advImageUploadPreview.src = self.previewImageSrc;
	    self.fitimagePreview.src = self.fitimagePreviewSrc;
	   
	   advImageUploadPreview.onload = function(){

		
	         var w = advImageUploadPreview.naturalWidth;
	        var h = advImageUploadPreview.naturalHeight;
	       console.log('Width');
		console.log(w);
	       console.log('Height');
		console.log(h);
               advImageUploadPreview.width = 100;
		  advImageUploadPreview.height = h/w * 100;
            }; 
	
         
	   var advImageUploadPreviewDiv = document.getElementById('advImageUploadPreview');
          advImageUploadPreviewDiv.innerHTML = "";
	   advImageUploadPreviewDiv.appendChild(advImageUploadPreview);
         
	

	};
	    
	self.checkoutDisable = function(){
		if(self.linkInput && self.validateLink() && self.imageUploaded){
		return false;
		}else if(self.imageUploaded && !self.linkInput){
		return false;
		}else{
		return true;
		}
	};
	self.checkout = function(){

		$state.go('cart');
	};

           $timeout(function(){
			self.setAdvImageUploadPreview();
			  		}, 100);

  
}
			
}]);


		

}; 