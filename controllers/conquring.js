var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

app.get('/api/v1/conquringsByMapId/:mapId', middleware.requireAuthentication, function(req,res){
 
var mapId = parseInt(req.params.mapId, 10);
var where = {mapId: mapId};
  db.conquering.findAndCountAll({
    where: where
     }).then(function(conqur) {
      console.log('conqur by mapID');
	console.log(conqur);
       res.json(conqur);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

app.get('/api/v1/conquringsByUser', middleware.requireAuthentication, function(req,res){
var userId = req.user.id;
var where = {userId: userId};
  db.conquering.findAndCountAll({
    where: where
     }).then(function(conqur) {
      console.log('conqur');
	console.log(conqur);
       res.json(conqur);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

//Post /Map
app.put('/api/v1/conquringMapConfigs/:mapId', [bodyParser.json(), middleware.adminOnly], function(req, res){
 var mapId = parseInt(req.params.mapId, 10);
 var body = _.pick(req.body, 'hasNewTiles', 'hasNewStart', 'hasNewFinish');


        db.conquering.find({mapId: mapId}).then(function(c){   
             
		c.update(body).then(function(conqur){
				
  			  console.log('conqur Update');
			  console.log(conqur);
     			  res.json(conqur);

			},function(err){
			  
                         res.status(200).json(mapPulse.toJSON());

			});
        },function(err){
            res.status(400).json(err);
        });

});




};
