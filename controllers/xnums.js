var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');

module.exports.controller = function(app) {

app.get('/api/v1/xnum', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    
   var where = {};

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
  

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY')) {
    where.locX = {$gte: parseInt(query.locX)-100, $lte: parseInt(query.locX)+100};
    where.locY = {$gte: parseInt(query.locY)-100, $lte: parseInt(query.locY)+100};
  }


  db.xnum.findAll({
    where: where,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(xnum) {
    res.json(xnum);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

app.get('/api/v1/userxnum', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    console.log('User in Get user xnum');
	console.log(req.user);

   var where = {};
	where.found = true;
	where.userId = req.user.id;


  db.xnum.findAll({
    where: where
  }).then(function(xnum) {
    res.json(xnum);
  }, function(e) {
    res.status(500).json(e);
  });

  
});



app.get('/api/v1/xnumCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.xnum.findAndCountAll({
    where: where
  }).then(function(xnum) {
    res.json(xnum.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});


app.get('/api/v1/xnum/:id', middleware.requireAuthentication, function(req,res){
   var xnumId = parseInt(req.params.id, 10);
    db.xnum.findById(xnumId).then(function(xnum){
        if(!!xnum){
            res.status(200).json(xnum.toJSON());
        }else{
            res.status(404).send();
        }
    },function(err){
            res.status(500).json(err);
    });
   
});


//DELETE /xnum/:id
app.delete('/api/v1/xnum/:id', middleware.adminOnly, function(req, res){
var xnumId = parseInt(req.params.id, 10);
 
  db.xnum.destroy({where: {id: xnumId}}).then(function(deleted){
         if(deleted){
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No xnum with id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

});

//Post /Map
app.post('/api/v1/xnum', [bodyParser.json(),  middleware.adminOnly], function(req, res){
var body = _.pick(req.body, 'locX', 'locY', 'gu', 'gr', 'gd', 'gl');

        db.xnum.create(body).then(function(xnum){   
             res.status(200).json(xnum.toJSON());
        },function(err){
            res.status(400).json(err);
        });

      

});

//Put /xnum/:id
app.put('/api/v1/xnum/:id',  [bodyParser.json(), middleware.adminOnly], 
  function(req, res){
var xnumId = parseInt(req.params.id, 10);

var body = _.pick(req.body, 'locX', 'locY', 'valDollar');
///Some Validation on the post.

  var attributes = {};

  if (body.hasOwnProperty('locX')) {
    attributes.locX = body.locX;
  }
  if (body.hasOwnProperty('locY')) {
    attributes.locY = body.locY;
  }

   if (body.hasOwnProperty('valDollar')) {
    attributes.valDollar = body.valDollar;
  }


  db.xnum.findById(xnumId).then(function(xnum) {
    if (xnum) {
      xnum.update(attributes).then(function(xnum) {
        res.json(xnum.toJSON());
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

};

