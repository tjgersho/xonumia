var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');
var bodyParser = require('body-parser');

module.exports.controller = function(app) {

app.get('/api/v1/prodoption', [bodyParser.json(), middleware.requireAuthentication], function(req,res){
 
    var where = {};

    var order  = [['id', 'ASC']];

  db.prodoption.findAll({
    where: where,
    order: order
  }).then(function(map) {
    res.json(map);
  }, function(e) {
    res.status(500).json(e);
  });

  
});




app.post('/api/v1/prodoption', [bodyParser.json(), middleware.adminOnly], function(req, res){

var body = _.pick(req.body,
		      'catId',
			'name'
                       );
	console.log('Prodoptioncat id ', body.catId);

          db.prodoptioncat.find({where: {id: body.catId}}).then(function(cat){
		console.log(cat);
                            if(!!cat){
                              
                  db.prodoption.create({'name': body.name}).then(function(optn){
                      optn.setProdoptioncat(cat).then(function(opt){

                                              res.status(200).json(opt.toJSON());
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



app.put('/api/v1/prodoption/:id', [bodyParser.json(), middleware.adminOnly], function(req, res){

var prodoptionId = parseInt(req.params.id, 10);

		var body = _.pick(req.body,
			 'name', 'price', 'inventory', 'imglink', 'status'
			   );

         var attributes = {};
 
  if (body.hasOwnProperty('name')) {
    attributes.name = body.name;
  }
  if (body.hasOwnProperty('price')) {
    attributes.price = body.price;
  }
  if (body.hasOwnProperty('inventory')) {
    attributes.inventory = body.inventory;
  }
  if (body.hasOwnProperty('imglink')) {
    attributes.imglink = body.imglink;
  }
   if (body.hasOwnProperty('status')) {
    attributes.status = body.status;
  }

   db.prodoption.findById(prodoptionId).then(function(opts) {
     if (opts){
       opts.update(attributes).then(function(opts) {
         res.json(opts.toJSON());
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



app.delete('/api/v1/prodoption/:id',  [bodyParser.json(), middleware.adminOnly], function(req, res){

var prodoptionId = parseInt(req.params.id, 10);

     db.prodoption.destroy({where: {id: prodoptionId}}).then(function(deleted){
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