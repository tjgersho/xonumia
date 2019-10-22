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

app.get('/api/v1/advPurchase', middleware.adminOnly, function(req,res){
 
   var query  = req.query;
    
   var where = {};

   var include = [];


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
  

          db.advPurchase.findAll({
              where: where,
              limit: limit,
              offset: offset,
              order: order,
              include: include
            }).then(function(advPurchs) {	
			console.log('advPurchs..');
			console.log(advPurchs)			
                     res.json(advPurchs);
                }, function(e) {
                  res.status(500).json(e);
           });



  
});


app.get('/api/v1/advPurchaseCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.advPurchase.findAndCountAll({
    where: where
  }).then(function(advPurchs) {
    res.json(advPurchs.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});


//DELETE /adv/:id
app.delete('/api/v1/advPurchase/:id',  middleware.adminOnly, function(req, res){
var advPurchaseId = parseInt(req.params.id, 10);
	
  db.advPurchase.destroy({where: {id: advPurchaseId}}).then(function(deleted){
         if(deleted){
          
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No adV with that id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

});





//Post /adv
app.post('/api/v1/advPurchase', [bodyParser.json(), middleware.adminOnly],  function(req, res){ //


var body = _.pick(req.body, 'locX', 'locY', 'width', 'height');

var mapId = _.pick(req.body, 'mapId');

body.img = 'sponsorshipavailable.png'; 

console.log('BODY in the POST ADV');
console.log(body);

 db.map.find({where: {id: mapId.mapId}}).then(function(map){
       if(!!map && (map.userId === req.user.id ) ){


                 db.advPurchase.create(body).then(function(adv){
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


};


