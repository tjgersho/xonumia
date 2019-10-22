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

app.get('/api/v1/xnumRequestPayment', middleware.adminOnly, function(req,res){
 
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
  

          db.paymentRequest.findAll({
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


app.get('/api/v1/xnumRequestPaymentCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.paymentRequest.findAndCountAll({
    where: where
  }).then(function(xnumRequestPayment) {
    res.json(xnumRequestPayment.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});


//DELETE /adv/:id
app.delete('/api/v1/xnumRequestPayment/:id',  middleware.adminOnly, function(req, res){
var xnumRequestPaymentId = parseInt(req.params.id, 10);
	
  db.paymentRequest.destroy({where: {id: xnumRequestPaymentId}}).then(function(deleted){
         if(deleted){
          
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No adV with that id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

});





//Post /xnumRequest! Create Request...

app.post('/api/v1/xnumRequestPayment', [bodyParser.json(), middleware.adminOnly],  function(req, res){ //


var body = _.pick(req.body, 'userId', 'amount', 'xnumCount');
var xnumList = _.pick(req.body, 'xnumIdList');


                 db.paymentRequest.create(body).then(function(request){
			
			xnumList.forEach(function(xn){
				db.xnum.find({
					where:{
						id:      xn.id, 
						userId: body.userId
						},
					include:[{model: db.paymentRequest},
						  {model: db.xnumPayment}
						]

					}).then(function(xnum){
				console.log('XNUM Found For Request of Payment');
				console.log(xnum.getPaymentRequest());

				xnum.setPaymentRequest(request).then(function(xnum){
						console.log('Found Xnum to Set Payment Request');
					
				},function(err){


				});
			 });

                


                        },function(err){
                           res.status(400).json(err);
                        });
                  
                  },function(err){
                     res.status(400).json(err);
                  });



   });


};


