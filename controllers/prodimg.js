var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
//var request = require('request');
var inspect = require('util').inspect;
var os = require('os');
var uuid = require('uuid');
var path = require('path');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var im = require("imagemagick"); 


var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false});


module.exports.controller = function(app) {




function resizeImgs(path, prodId, id, ext){

return new Promise(function(resolve, reject) {
   
         var originalFile = path + 'prod_' + prodId + '_' + id + '_O' + ext;
	  var resizedFile = path + 'prod_' + prodId + '_' + id + '_L' + ext;

 
          var optionsL = {
              width: 1000,
              srcPath: originalFile,
              dstPath: resizedFile
            };
 
	     resizedFile = path + 'prod_' + prodId + '_' + id + '_M' + ext;
	
         var optionsM = {
              width: 500,
              srcPath: originalFile,
              dstPath: resizedFile
            };

          resizedFile = path + 'prod_' + prodId + '_' + id + '_S' + ext;

	  var optionsS = {
              width: 100,
              srcPath: originalFile,
              dstPath: resizedFile
            };
 

          im.resize(optionsL, function(err) {
                if(err) { reject('fail'); }
	
		   im.resize(optionsM, function(err) {
			if(err) { reject('fail'); }

			im.resize(optionsS, function(err) {
			if(err) { reject('fail'); }

                        resolve("images resized");
                      });
                  });
	     });

   });

}



app.post('/api/v1/prodimg', [fileUpload(), middleware.adminOnly], function(req, res){


console.log(req.files);

 var body = _.pick(req.body, 'prodId', 'imgnum');

 console.log(body);

      if (!req.files) {
          res.send('No files were uploaded.');
          return;
      }




          db.merch.find({where: {id: body.prodId}}).then(function(prod){
                   if(!!prod){
      
	    db.prodimg.create({}).then(function(img){
			         img.setMerch(prod).then(function(img){
                                        
                     // var d = new Date(); 
			  var databaseFileName =   'prod_' + body.prodId + '_' + img.id;
     	                var newFileName = 'prod_' + body.prodId + '_' + img.id + '_O';
                          var ext = path.extname(req.files.file.name);
                                    
    					  img.update({img: databaseFileName + ext}).then(function(img){
                            
    					  var target = './cdn/public/prodImages/'+body.prodId+'/'+ newFileName + ext;

  	
      						req.files.file.mv(target, function(err) {
    
       					  if (err) {
                                                 res.status(500).send(err);
         
                                             } else {
							    var path = './cdn/public/prodImages/'+body.prodId+'/';

                                                        resizeImgs(path, body.prodId,  img.id, ext).catch(function(err){
										console.log('ERR in catch function');
										console.log(err);
                                                         });
     
								res.status(200).json(img.toJSON());
                                             }

                                            });

                                           
                                            });
                                        
                                          },function(err){
                                               
                                                 res.status(400).json(err);
                                         });

		},function(err){
			
			 res.status(500).send(err);
		});
             

                   }else{
                                 
                                res.status(404).send();
                    }
             },function(err){

             res.status(400).json(err);
             });


});


app.delete('/api/v1/prodimg/:id',  [bodyParser.json(), middleware.adminOnly], function(req, res){

var prodimgId = parseInt(req.params.id, 10);
db.prodimg.find({where: {id: prodimgId}}).then(function(img){
       if(!!img){
	console.log('DELETED IMG');
	console.log(img);
     db.prodimg.destroy({where: {id: prodimgId}}).then(function(deleted){

         if(deleted){
            var filePath = './cdn/public/prodImages/'+img.merchId+'/'; 
            var ext = path.extname(img.img);
	     var fileName = path.basename(img.img, ext);
            fs.unlinkSync(filePath+fileName+'_O'+ext);
            fs.unlinkSync(filePath+fileName+'_L'+ext);
            fs.unlinkSync(filePath+fileName+'_M'+ext);
            fs.unlinkSync(filePath+fileName+'_S'+ext);
            res.status(204).send();
         } else{
          res.status(404).json({error: 'Item not Deleted...'});
         }
      },function(err){
         res.status(500).json(err);
   }); 
      }else{

          res.status(400).json();

	}
   });


});


};