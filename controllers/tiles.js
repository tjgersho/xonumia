var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

app.get('/api/v1/tile', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    
   var where = {};

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY') && !query.hasOwnProperty('w') && !query.hasOwnProperty('h')) {
    where.locX = {$gte: parseInt(query.locX)-100, $lte: parseInt(query.locX)+100};
    where.locY = {$gte: parseInt(query.locY)-100, $lte: parseInt(query.locY)+100};
  }

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY') && query.hasOwnProperty('w') && query.hasOwnProperty('h')) {
    where.locX = {$gte: parseInt(query.locX)-parseInt(query.w/2), $lte: parseInt(query.locX)-parseInt(query.w/2)+parseInt(query.w)};
    where.locY = {$gte: parseInt(query.locY)-parseInt(query.h/2), $lte: parseInt(query.locY)-parseInt(query.h/2)+parseInt(query.h)};
  }
    console.log('Query');
console.log(query);
	console.log("WHERE");

    console.log(where);

   var include = [];

if(query.hasOwnProperty('level')){

        db.map.findById(parseInt(query.level)).then(function(map){
              console.log('Tile Get map ID and user ID');
              console.log(map.userId);
              console.log(req.user.id);

              if(map.userId === req.user.id || map.userId === 0 || map.userId === 1){
              include[0] = {
                    model: db.map, 
                    where: 
                           {
                            id: parseInt(query.level)
                           }
                     
                   };


              db.tile.findAll({
                  where: where,
                  include: include
                }).then(function(tile) {
                  res.json(tile);
                }, function(e) {
                  res.status(500).json(e);
                });
              }else{
                res.status(401);
              }


              });

}else{

          db.tile.findAll({
              where: where
            }).then(function(tile) {
              res.json(tile);
            }, function(e) {
              res.status(500).json(e);
            });

}

  

  
});




app.get('/api/v1/tile/:id', middleware.requireAuthentication, function(req,res){

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


//DELETE /tile/:id
app.delete('/api/v1/tile/:id', middleware.requireAuthentication, function(req, res){
var tileId = parseInt(req.params.id, 10);
 
  db.tile.destroy({where: {id: tileId}}).then(function(deleted){
         if(deleted){
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No tile with id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

});


//Post /Map
app.post('/api/v1/tile', [bodyParser.json(), middleware.requireAuthentication], function(req, res){
//app.post('/api/v1/tile',  function(req, res){


var body = _.pick(req.body, 'locX', 'locY', 'gu', 'gr', 'gd', 'gl', 'color_r', 'color_g', 'color_b', 'color_a', 'isAdv');


var mapId = _.pick(req.body, 'mapId');

if(!!mapId){
db.tile.find({
     where:{
              locX: body.locX, 
              locY: body.locY,
             },
    include:[
    {
      model: db.map, 
      where: 
             {
              id: mapId.mapId
             }
       
     }]

  }).then(function(resp){
 
  if(!resp){

       db.map.find({where: {id: mapId.mapId}}).then(function(map){
                            if(!!map && (map.userId === req.user.id || map.userId === 0) ){
                              
                  db.tile.create(body).then(function(tile){
                      tile.setMap(map).then(function(tile){

                                       
                                    var updateBounds = false;
                                        if(map.minX > tile.locX){
                                          map.minX = Math.floor(tile.locX)+1;
                                          updateBounds = true;
                                        }
                                        if(map.maxX < tile.locX){
                                          map.maxX = Math.floor(tile.locX);
                                           updateBounds = true;
                                        }
                                        if(map.minY > tile.locY){
                                          map.minY = Math.floor(tile.locY)+1;
                                           updateBounds = true;
                                        }
                                        if(map.maxY < tile.locY){
                                          map.maxY = Math.floor(tile.locY);
                                           updateBounds = true;
                                        }
                                        
                                        if( updateBounds ){
                                          map.save().then(function(res){
                                          });
                                        }
                                                res.status(200).json(tile.toJSON());
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

  }else{
   //UPDATE THE TILE THEN>>>>
var tileId = parseInt(resp.id, 10);


  var attributes = {};

  if (body.hasOwnProperty('locX')) {
    attributes.locX = body.locX;
  }
  if (body.hasOwnProperty('locY')) {
    attributes.locY = body.locY;
  }
  if (body.hasOwnProperty('gu')) {
    attributes.gu = body.gu;
  }
   if (body.hasOwnProperty('gr')) {
    attributes.gr = body.gr;
  }
   if (body.hasOwnProperty('gd')) {
    attributes.gd = body.gd;
  }
   if (body.hasOwnProperty('gl')) {
    attributes.gl = body.gl;
  }

  if (body.hasOwnProperty('color_r')) {
    attributes.color_r = body.color_r;
  }
    if (body.hasOwnProperty('color_g')) {
    attributes.color_g = body.color_g;
  }
    if (body.hasOwnProperty('color_b')) {
    attributes.color_b = body.color_b;
  }
    if (body.hasOwnProperty('color_a')) {
    attributes.color_a = body.color_a;
  }
  
  db.tile.findById(tileId).then(function(tile) {
    if (tile) {
      tile.update(attributes).then(function(tile) {
        res.json(tile.toJSON());
      }, function(e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  });

  }
  
},function(resp){

 });


}else{

  res.status(400).json({"Error": "SET MAP ID"});
}


});

//Put /tile/:id
app.put('/api/v1/tile/:id', [bodyParser.json(), middleware.requireAuthentication], 
  function(req, res){
var tileId = parseInt(req.params.id, 10);

var body = _.pick(req.body, 'locX', 'locY', 'gu', 'gr', 'gd', 'gl');
///Some Validation on the post.

  var attributes = {};

  if (body.hasOwnProperty('locX')) {
    attributes.locX = body.locX;
  }
  if (body.hasOwnProperty('locY')) {
    attributes.locY = body.locY;
  }
  if (body.hasOwnProperty('gu')) {
    attributes.gu = body.gu;
  }
   if (body.hasOwnProperty('gr')) {
    attributes.gr = body.gr;
  }
   if (body.hasOwnProperty('gd')) {
    attributes.gd = body.gd;
  }
   if (body.hasOwnProperty('gl')) {
    attributes.gl = body.gl;
  }


  db.tile.findById(tileId).then(function(tile) {
    if (tile) {
      tile.update(attributes).then(function(tile) {
        res.json(tile.toJSON());
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
