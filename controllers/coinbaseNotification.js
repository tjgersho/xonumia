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

app.get('/api/v1/coinbaseNotification', middleware.adminOnly, function(req,res){
 
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
  

          db.coinbaseNotification.findAll({
              where: where,
              limit: limit,
              offset: offset,
              order: order,
              include: include
            }).then(function(coinbaseNotifications) {	
			console.log('coinbaseNotifications..');
			console.log(coinbaseNotifications)			
                     res.json(coinbaseNotifications);
                }, function(e) {
                  res.status(500).json(e);
           });



  
});


app.get('/api/v1/coinbaseNotificationCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.coinbaseNotification.findAndCountAll({
    where: where
  }).then(function(coinbaseNotifications) {
    res.json(coinbaseNotifications.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});


//DELETE /adv/:id
app.delete('/api/v1/coinbaseNotification/:id',  middleware.adminOnly, function(req, res){
var coinbaseNotificationId = parseInt(req.params.id, 10);
	
  db.coinbaseNotification.destroy({where: {id: coinbaseNotificationId}}).then(function(deleted){
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
app.post('/api/v1/coinbaseNotification', [middleware.requireAuthentication, bodyParser.json()],  function(req, res){ //


var body = _.pick(req.body, 'service', 'amount', 'items', 'height');

var mapId = _.pick(req.body, 'mapId');

body.img = 'sponsorshipavailable.png'; 

console.log('BODY in the POST ADV');
console.log(body);

   db.coinbaseNotification.create(body).then(function(sale){
                         res.json(sale);
                  
                  },function(err){
                     res.status(400).json(err);
              });


   });


};


