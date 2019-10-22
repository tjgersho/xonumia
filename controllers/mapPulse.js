var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

app.get('/api/v1/mapPulseByMapId/:mapId', middleware.requireAuthentication, function(req,res){
 
  var mapId = parseInt(req.params.mapId, 10);
var where = {mapId: mapId};
  db.mapPulse.findAndCountAll({
    where: where
     }).then(function(mapPulse) {
      console.log('Map Pulse');
	console.log(mapPulse);
       res.json(mapPulse.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

app.get('/api/v1/mapPulseClickAvailable/:mapId', middleware.requireAuthentication, function(req,res){
 
  var mapId = parseInt(req.params.mapId, 10);
  var userId = req.user.id;
  var where = {mapId: mapId, userId: userId};
console.log('Map Pulse Click Avail');
console.log(where);

  db.mapPulse.findAll({
    where: where
     }).then(function(mP) {
        console.log('Map Pulse..');
		console.log(mP);
	if(mP.length > 0){

		console.log('Map PUlse in Click Avail');
		console.log(mP);
      		res.json(mP);
       }else{

		res.status(409).json('Allow Pulse Click!');

	}
	
  }, function(e) {
     res.status(500).json(e);

  });

  
});


//DELETE /map/:id
app.delete('/api/v1/mapPulse/:id', middleware.requireAuthentication, function(req, res){
var mapPulseId = parseInt(req.params.id, 10);
 
 db.mapPulse.findById(mapPulseId).then(function(m){

   if(m.userId === parseInt(req.user.id) || req.user.id === 1){

        m.destroy().then(function(deleted){
         if(deleted){
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No MapPulse with id'});
         }
        },function(err){
         res.status(500).json(err);

       }); 
   }else{
	  res.status(404).json({error: 'Failed to destroy mapPulse'});

   }

 });



 

});

//Post /Map
app.post('/api/v1/mapPulse', [bodyParser.json(), middleware.requireAuthentication], function(req, res){
 
 var map = _.pick(req.body, 'mapId');

 var userId = req.user.id;

console.log('Map Pulse create');
	console.log(map);
	console.log(userId);



        db.mapPulse.create({mapId: map.mapId, userId: userId}).then(function(mapPulse){   
             res.status(200).json(mapPulse.toJSON());
        },function(err){
            res.status(400).json(err);
        });

});




};
