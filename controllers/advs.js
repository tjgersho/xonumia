//advertisements.js

var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var inspect = require('util').inspect;
var os = require('os');
var uuid = require('uuid');
var path = require('path');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var im = require("imagemagick"); 

var AWS = require('aws-sdk'); 


module.exports.controller = function(app) {


function putObjectS3(myKey, fileStream){

    return new Promise(function(resolve, reject) {

	var s3 = new AWS.S3();
       var putParams = {
  		  Bucket: 'xonumia-public',
    		  Key: myKey,
   		  Body: fileStream
	    };
	 s3.putObject(putParams, function(putErr, putData){
  		  if(putErr){
      		        reject(putErr);
   		 } else {
     		       resolve(putData);
   		 }
	  });
  });
}

function moveToS3(advId, time, type){

  return new Promise(function(resolve, reject) {
	db.adv.findById(advId).then(function(adv){
	 var ext = path.extname(adv.img);
	 console.log('MOVE TO S3 IMG');
	 console.log(adv.img);
	
	 var fileName = path.basename(adv.img, ext);

	 var file = 'adv_' + advId + '_' + time + type + ext;

	 var myKey = 'advImages/'+advId+'/' + file;
	 var localPath = "./cdn/public/advImages/"+advId+"/";
	
      
 
       
	   var fileStream = fs.createReadStream(localPath+file);
  
          return putObjectS3(myKey, fileStream).then(function(resp){

		resolve("images pushed to S3");

            });
	
	   

	},function(err){
           console.log('Move To S3 Error - Could not find Adv');
	    console.log(err);
	    reject(err);
	});

    });

}


function deleteObjectS3(objKey){

    return new Promise(function(resolve, reject) {

	var s3 = new AWS.S3();
       var deleteParams = {
  		  Bucket: 'xonumia-public',
    		  Key: objKey	   
              };

	 s3.deleteObject(deleteParams, function(delErr, delData){
  		  if(delErr){
      		        reject(delErr);
   		 } else {
     		       resolve(delData);
   		 }
	  });
  });
}



function deleteFromS3(advId, file){

 return new Promise(function(resolve, reject) {
	
	 var myKey = 'advImages/'+advId+'/' + file;
	
          return deleteObjectS3(myKey).then(function(resp){
		console.log(resp);
		resolve("image deleted from s3");

            });

    });





}

function resizeAdvImgs(path, id, time, ext){

return new Promise(function(resolve, reject) {
   
         var originalFile = path + 'adv_' + id + '_' + time + '_O' + ext;
	  var resizedFile = path + 'adv_' + id + '_' + time + '_L' + ext;

 
          var optionsL = {
              width: 1000,
              srcPath: originalFile,
              dstPath: resizedFile
            };
 
	     resizedFile = path + 'adv_' + id + '_' + time + '_M' + ext;
	
         var optionsM = {
              width: 500,
              srcPath: originalFile,
              dstPath: resizedFile
            };

          resizedFile = path + 'adv_' + id + '_' + time + '_S' + ext;

	  var optionsS = {
              width: 100,
              srcPath: originalFile,
              dstPath: resizedFile
            };
 

          im.resize(optionsL, function(err) {
                if(err) { reject('fail'); }
		   moveToS3(id, time, '_O');
                  moveToS3(id, time, '_L');
		   im.resize(optionsM, function(err) {
			if(err) { reject('fail'); }
                       moveToS3(id, time, '_M');
			im.resize(optionsS, function(err) {
			if(err) { reject('fail'); }
                         moveToS3(id, time, '_S');
                         resolve("images resized");
                      });
                  });
	     });

   });

}


var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
};



var rmDir = function(dirPath) {
	console.log(dirPath);

   try { var files = fs.readdirSync(dirPath); }
   catch(e) { return; }
    console.log('f');
     if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }

   fs.rmdirSync(dirPath);
};

app.get('/api/v1/adv',  middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    
   var where = {};

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY')) {
    where.locX = parseInt(query.locX);
    where.locY = parseInt(query.locY);
  }

   var include = [];

  if(query.hasOwnProperty('level')){

        db.map.findById(parseInt(query.level)).then(function(map){
              console.log('Tile Get map ID and user ID');
              console.log(map.userId);
              console.log(req.user.id);

              if(!!map.id){
              include[0] = {
                    model: db.map, 
                    where: 
                           {
                            id: parseInt(query.level)
                           }
                     
                   };


              db.adv.findAll({
                  where: where,
                  include: include
                }).then(function(adv) {	
			console.log('adv..');
			adv.forEach(function(a){
				  var ext = path.extname(a.img);
				 console.log(a);

	                       var fileName = path.basename(a.img, ext);
				  a.dataValues.imgL = fileName+'_L'+ext;
				  a.dataValues.imgM = fileName+'_M'+ext;
                              a.dataValues.imgS = fileName+'_S'+ext;

                       });
                  
			
                  res.json(adv);
                }, function(e) {
                  res.status(500).json(e);
                });


              }else{
                res.status(401);
              }


              });

  }else{

    var limit;
    var offset;
    var order;
	
   
 	 if(query.hasOwnProperty('limit')){
		  limit = parseInt(query.limit);
  	 }
  	 if(query.hasOwnProperty('page')){
    		 offset =  parseInt(query.page)*limit;
  	 }
  	 if(query.hasOwnProperty('order')){
	    	 order = parseInt(query.order); 
  	  }
  

          db.adv.findAll({
              where: where,
              limit: limit,
              offset: offset,
              order: order,
              include: include
            }).then(function(adv) {
              adv.forEach(function(a){
				   var ext = path.extname(a.img);
				 console.log(a);

	                       var fileName = path.basename(a.img, ext);
				  a.dataValues.imgL = fileName+'_L'+ext;
				  a.dataValues.imgM = fileName+'_M'+ext;
                              a.dataValues.imgS = fileName+'_S'+ext;

                       });

              res.json(adv);
            }, function(e) {
              res.status(500).json(e);
            });

 }

  

  
});


app.get('/api/v1/advCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.adv.findAndCountAll({
    where: where
  }).then(function(adv) {
    res.json(adv.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

app.get('/api/v1/adv/:id',  middleware.requireAuthentication, function(req,res){

   var tileId = parseInt(req.params.id, 10);

    db.tile.findById(tileId).then(function(tile){
        if(!!tile){
            res.status(200).json(tile.toJSON());
        }else{
            res.status(404).send();
        }
    },function(err){
            res.status(500).json(err);
    });
   
});



app.get('/api/v1/userAdv',  middleware.requireAuthentication, function(req,res){
console.log('In Get User Advs');

    var userId = req.user.id;
var where = {userId: userId};
console.log(where);
    db.adv.findAndCountAll({
    where: where
  }).then(function(advs) {
	
    res.json(advs);
  }, function(e) {
    res.status(500).json(e);
  });
   
});

///Post to ID... Add the advertisement..  User calls this in the checkout process... 

app.post('/api/v1/adv/:id', [fileUpload(), middleware.requireAuthentication], function(req, res){

// var body = _.pick(req.body, 'modata', 'stuff');

// console.log(body);

      if (!req.files) {
          res.send('No files were uploaded.');
          return;
      }
        var date = new Date();

       var time = date.getTime();
      var advId = parseInt(req.params.id, 10);
      db.adv.findById(advId).then(function(adv){

         var databaseFileName =  'adv_' + adv.id + '_' + time;
     	  var newFileName = databaseFileName + '_O';
          var ext = path.extname(req.files.file.name);
                                    
            adv.update({img: databaseFileName + ext}).then(function(adv){
                            
    		 var target = './cdn/public/advImages/'+adv.id+'/'+ newFileName + ext;

                     req.files.file.mv(target, function(err) {
    
                                if (err) {
                                 res.status(500).send(err);
         
                                 } else {
					 var path = './cdn/public/advImages/'+adv.id+'/';

                                      resizeAdvImgs(path, adv.id, time, ext).then(function(resp){
							res.status(200).json(adv.toJSON());
                                          }).catch(function(err){
							console.log('ERR in catch function');
							console.log(err);
                                                     });
     
						
                                             }

                                         });

                                           
                                    });
                                        
             },function(err){
                                               
                res.status(400).json(err);
         });

 
    
    


});

//DELETE /adv/:id
app.delete('/api/v1/adv/:id',  middleware.adminOnly, function(req, res){
var advId = parseInt(req.params.id, 10);
	
  db.adv.destroy({where: {id: advId}}).then(function(deleted){
         if(deleted){
          
          rmDir('./cdn/public/advImages/'+advId);
	

          res.status(204).send();
         } else{
          res.status(404).json({error: 'No adV with that id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

});




//DELETE /adv/  .. query params in locX, locY
app.delete('/api/v1/adv',  middleware.adminOnly, function(req, res){
  var query  = req.query;
    
   var where = {};

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY')) {
    where.locX = parseFloat(query.locX);
    where.locY = parseFloat(query.locY);
  }else{

    res.status(400).json(err);
  }

  console.log(where);
  db.adv.find().then(function(aDv){

	 var ext = path.extname(aDv.img);
	 console.log('DeleteObject from S3 - IMG');
	 console.log(aDv.img);
	
	 var fileName = path.basename(aDv.img, ext);

	 var file = fileName + '_O' + ext;
                deleteFromS3(aDv.id, file);
         file = fileName + '_L' + ext;
	         deleteFromS3(aDv.id, file);
         file = fileName + '_M' + ext;
                deleteFromS3(aDv.id, file);
         file = fileName + '_S' + ext;
                deleteFromS3(aDv.id, file);

    db.adv.destroy({where: {id: aDv.id}}).then(function(deleted){
         if(deleted){
            console.log('DELETING ADV.. deleteing FOLDER');
		console.log(deleted);
               rmDir('./cdn/public/advImages/'+aDv.id);
               

          res.status(204).send();
         } else{
          res.status(404).json({error: 'No adV with that id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 
  },function(err){
         res.status(500).json(err);
 }); 



});




//Post /adv
app.post('/api/v1/adv', [bodyParser.json(), middleware.adminOnly],  function(req, res){ //


var body = _.pick(req.body, 'locX', 'locY', 'width', 'height');

var mapId = _.pick(req.body, 'mapId');

body.img = 'sponsorshipavailable.png'; 

console.log('BODY in the POST ADV');
console.log(body);

 db.map.find({where: {id: mapId.mapId}}).then(function(map){
       if(!!map && (map.userId === req.user.id ) ){


                 db.adv.create(body).then(function(adv){
                  adv.setMap(map).then(function(adv){
			      mkdirSync('./cdn/public/advImages/'+adv.id);
                          res.status(200).json(adv.toJSON());
                        },function(err){
                           res.status(400).json(err);
                        });
                  
                  },function(err){
                     res.status(400).json(err);
                  });



          }else{
                                 
              res.status(404).send();
          }

        },function(err){

             res.status(400).json(err);
        });

   });




app.put('/api/v1/adv/:id', [bodyParser.json(), middleware.adminOnly],  function(req, res){ //


 var body = _.pick(req.body, 'userId', 'sponsorshipInterest', 'aspect', 'hasLink', 'link', 'available');

 var advId = parseInt(req.params.id, 10);
console.log('In Adv Put');
console.log(body);
 db.adv.find({where: {id: advId}}).then(function(advv){
       if(!!advv){
	   console.log('ADVV UPDATE');
		advv.update(body).then(function(resp){
			 res.status(200).json(resp);
		},function(err){
			 res.status(400).json(err);
		});
	}

 });

});




};


