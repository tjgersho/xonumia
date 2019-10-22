require('angular');
var $ = require('jquery');

module.exports.directive = function(){
'use strict';
angular.module('Directives').directive('storeItem', ['$window', '$state', '$http', 'Global', 'User', 'Merch', function($window, $state, $http, Global, User, Merch){
   var directiveObj = {};

   directiveObj.restrict = 'E';
   directiveObj.templateUrl = 'partials/storeitemadmin';
    directiveObj.scope = {
          storeitem: '=storeitem',
          getstore: '&'
           };

   directiveObj.link = function($scope, $element, $attrs){
   	            		
	  console.log("STORE ITEM ITEM");
	  console.log($scope.storeitem);
	  $scope.dberror = '';
	  
        //for(var i=0; i<$scope.storeitem.models.length; i++){
        
       // $scope.storeitem.models[i].color = "#" + parseInt($scope.storeitem.models[i].color, 16);
        //}
             
   $scope.updatename = function(id, name){
   console.log(id);
   console.log(name);
   
   $http.put('/api/v1/merch/' + id,{'name': name}, {headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Name Resp');
	   console.log(resp);
	   
    },function(err){
     console.log('Update Name Err');
      console.log(err); $scope.dberror = err;
     });

   };
   
  $scope.updatebaseprice = function(id, baseprice){
   console.log(baseprice);
   console.log(id);
   
      $http.put('/api/v1/merch/' + id, {'baseprice': baseprice}, {headers:{auth: User.token}}).then(function(resp){
	   console.log('Update BasePrice Resp');
	   console.log(resp);
	   
      },function(err){
         console.log('Update BasePrice Err');
          console.log(err); $scope.dberror = err;
   
      });
   
    };  
   
   $scope.updatewholesaleprice = function(id, wprice){
   console.log(wprice);
   console.log(id);
   
   $http.put('/api/v1/merch/' + id, {'wholesaleprice': wprice}, {headers:{auth: User.token}}).then(function(resp){
	   console.log('Update WholesalePrice Resp');
	   console.log(resp);
	   
      },function(err){
        console.log('Update WholesalePrice Err');
        console.log(err); $scope.dberror = err;
    });
     
   };

  $scope.updateprodinfo = function(id, prodinfo){
   console.log(prodinfo);
   console.log(id);
    
      	   $http.put('/api/v1/merch/' + id, {'prodinfo': prodinfo}, {headers:{auth: User.token}}).then(function(resp){
		   console.log('Update Product info Resp');
		   console.log(resp);
		   
	    },function(err){
		   console.log('Update Product info  Err');
		  console.log(err); $scope.dberror = err;
	    });

   };


  
   
   $scope.addnewdescription = function(id, desc, descripnum){
   	console.log(id);
   	console.log(desc);
	console.log(descripnum);
      if(descripnum === undefined){
		descripnum = 0;
	}

        $http.post('/api/v1/proddesc', 
		{'prodId': id, 'description':desc,  'descripnum': descripnum}, 
				{headers:{auth: User.token}}).then(function(resp){
	   console.log('Add New Description Resp');
	   console.log(resp);
	   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
      },function(err){
	   console.log('Add New Description Err');
	  console.log(err); $scope.dberror = err;
      });
      
   };

 $scope.deletedescrip = function(id){
	   console.log(id);
	  
	     $http.delete('/api/v1/proddesc/'+id,{headers:{auth: User.token}}).then(function(resp){
		   console.log('Delete Description Resp');
		   console.log(resp);
		   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
	      },function(err){
		   console.log('Delete Description Err');
		  console.log(err); $scope.dberror = err;
	      });

   };

  
   $scope.updatedescription = function(id, index, desc){
   	console.log(id);
   	console.log(index);
   	console.log(desc);
   	//$scope.storeitem.description[index] = desc;
   

   $http.put('/api/v1/proddesc/'+id,{'descripnum': index, 'description': desc}, {headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Description Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Description Err');
	  console.log(err); $scope.dberror = err;
    });

   };



	$scope.addpicfile = [];
	
	$scope.uploadProgress = 0;
	$scope.uploading = false;

	$scope.uploadProgressStyle = function(){
		return {'width' : $scope.uploadProgress + '%'};
	};

	$scope.uploadFileToUrl = function(file, uploadUrl, index){
              console.log('UPLOAD URL');
              console.log(uploadUrl);
		var fd = new FormData();
		console.log('Files');
		console.log(file.files);
		fd.append('file', file.files[0]);
		console.log('Image Index');
		console.log(index);
		fd.append('imgnum', index);
		fd.append('prodId', $scope.storeitem.id);
		
		console.log(fd);

		$scope.uploadProgress = 0;

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
							    $scope.uploadProgress = Math.round(e.loaded * 100 / e.total);
							     console.log("progress: " + $scope.uploadProgress + "%");
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
			 		console.log('image Upload Resp');
			 		console.log(resp);

					 loader.hide();
					
                                     $scope.addpicfile = [];
                                     document.getElementById("file"+$scope.storeitem.id).value = "";

					 $scope.uploading = false;

                                   $scope.getstore();
			 }, function(err){
			 	console.log('Image Upload Error');

			 	console.log(err);
			         loader.hide();
					 
			   $scope.uploading = false;

			 });




			};

			var loader = $('#loader');

		 $scope.uploadProdImg = function(index){
			
			loader.show();
			$scope.uploading = true;
			var file =  document.getElementById("file"+$scope.storeitem.id);
			var url = '/api/v1/prodimg';
			console.log(url, file);
			$scope.uploadFileToUrl(file, url, index);
		   };

			


          $scope.delprodimage = function(id){
	        console.log(id);
	  
	     $http.delete('/api/v1/prodimg/'+id,{headers:{auth: User.token}}).then(function(resp){
		   console.log('Delete Description Resp');
		   console.log(resp);
		   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
	      },function(err){
		   console.log('Delete Description Err');
		  console.log(err); $scope.dberror = err;
	      });

   };


  $scope.updateinventory = function(id, inventory){
     
     console.log(inventory);
   console.log(id);
    
      	   $http.put('/api/v1/merch/' + id, {'inventory':inventory}, {headers:{auth: User.token}}).then(function(resp){
		   console.log('Update Inventory');
		   console.log(resp);
		   
	    },function(err){
		   console.log('Update Product info  Err');
		  console.log(err); $scope.dberror = err;
	    });

    
   }; 

 
   $scope.addoptioncat = function(id,  cat){
  console.log(id);
   	console.log(cat);
	
      if(cat === undefined){
		cat = '';
	}

        $http.post('/api/v1/prodoptioncat', 
		{'prodId': id, 'name':cat}, 
				{headers:{auth: User.token}}).then(function(resp){
	   console.log('Add New Option Category');
	   console.log(resp);
	   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
      },function(err){
	   console.log('Add New Description Err');
	  console.log(err); $scope.dberror = err;
      });
   };



   

 $scope.addoptiontoexistingcategory = function(catId, optname){
   console.log(catId);
   console.log(optname);
    
    var addoptiontoexistingcategoryobj = {'catId': catId, 'name': optname};
   $http.post('/api/v1/prodoption', addoptiontoexistingcategoryobj, {headers:{auth: User.token}}).then(function(resp){
	   console.log('Add option to existiong category');
	   console.log(resp);
	   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
    },function(err){
	   console.log('Add option to existiong category ERR');
	  console.log(err); $scope.dberror = err;
    });
    
  };

$scope.deleteoption = function(id){
	   console.log(id);
	  
	     $http.delete('/api/v1/prodoption/'+id,{headers:{auth: User.token}}).then(function(resp){
		   console.log('Delete Description Resp');
		   console.log(resp);
		   $scope.getstore();     /// This calls the parent adminCtrl.getadminstore()
	      },function(err){
		   console.log('Delete Description Err');
		  console.log(err); $scope.dberror = err;
	      });

 
   
   };

  $scope.updateoptionCatname = function(catId, name){
   console.log(catId, name);
   
   $http.put('/api/v1/prodoptioncat/'+catId, {'name': name},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option Cat Name Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
  
   };


  $scope.updateoptionname = function(optionId, name){
   console.log(optionId, name);
   
   $http.put('/api/v1/prodoption/'+optionId, {'name': name},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option Name Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
  
   };

$scope.updateoptionprice = function(optionId, val){
   console.log(optionId,  val);
   
   $http.put('/api/v1/prodoption/'+optionId, {'price': val},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option Price Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
 
   };

  
  $scope.updateoptionimglink = function(optionId, index){
   console.log(optionId, index);
   
   
    $http.put('/api/v1/prodoption/'+optionId, {'imglink': index},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option imglink Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
   
   };

   $scope.updateoptioninventory = function(optionId, inventory){
   console.log(optionId, inventory);
   
    $http.put('/api/v1/prodoption/'+optionId, {'inventory': inventory},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option inventory Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
   
   };

   
   $scope.updateOptionstatus = function(optionId, eNum){
    console.log(optionId, eNum);
   
   $http.put('/api/v1/prodoption/'+optionId, {'status': eNum},{headers:{auth: User.token}}).then(function(resp){
	   console.log('Update Option Status Resp');
	   console.log(resp);
	   
    },function(err){
	   console.log('Update Option Name Err');
	  console.log(err); $scope.dberror = err;
    });
   
   };





   };

  

return directiveObj;
}]);


};