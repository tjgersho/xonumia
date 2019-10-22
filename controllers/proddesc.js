
var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');
var bodyParser = require('body-parser');

module.exports.controller = function(app) {


app.post('/api/v1/proddesc', [bodyParser.json(), middleware.adminOnly], function(req, res){

var body = _.pick(req.body,
			 'prodId',
			 'description', 
			  'descripnum'
                       );

          db.merch.find({where: {id: body.prodId}}).then(function(prod){
                            if(!!prod){
                              
                  db.proddesc.create({'description': body.description, 'descripnum': body.descripnum}).then(function(desc){
                      desc.setMerch(prod).then(function(desc){

                                              res.status(200).json(desc.toJSON());
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



app.put('/api/v1/proddesc/:id', [bodyParser.json(), middleware.adminOnly], function(req, res){

var proddescId = parseInt(req.params.id, 10);

		var body = _.pick(req.body,
			 'description', 
			  'descripnum'
                       );

         var attributes = {};
 
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }
  if (body.hasOwnProperty('descripnum')) {
    attributes.descripnum = body.descripnum;
  }
  

      db.proddesc.findById(proddescId).then(function(desc) {
    if (desc){
      desc.update(attributes).then(function(descrip) {
        res.json(descrip.toJSON());
      }, function(e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  });



});



app.delete('/api/v1/proddesc/:id',  [bodyParser.json(), middleware.adminOnly], function(req, res){

var proddescId = parseInt(req.params.id, 10);

     db.proddesc.destroy({where: {id: proddescId}}).then(function(deleted){
         if(deleted){
            res.status(204).send();
         } else{
          res.status(404).json({error: 'Item not Deleted...'});
         }
      },function(err){
         res.status(500).json(err);
   }); 


});


};