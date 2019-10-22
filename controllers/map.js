var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');

var bodyParser = require('body-parser');
module.exports.controller = function(app) {

app.get('/api/v1/mapedits', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    

  var user = req.user;

    var where = {
    $or: [
        {userId: user.id}, 
        {userId: 0}

        ]
      };

    var limit = 10;
    var offset = 0;
    var order  = [['id', 'ASC']];


   if(query.hasOwnProperty('page')){
     offset = query.page*10;
    }

   

   // if (query.hasOwnProperty('stage')) {
   //   where.id = query.stage;
   //   offset = 0;
   //   limit = 1;
  //    order = [];
   // }

   if(query.hasOwnProperty('orderBy')){
	
             db.map.findAll({
  		  where: where,
		  order: order
 		 }).then(function(map) {

		     var promises = map.map(function(m){
   			 return  m.getPulse().then(function(resp){
					m.dataValues.pulse = resp.length;	
     				});

			});

  		
 			return Promise.all(promises).then(function(){
					map.sort(function(a, b){
						if(b.dataValues.pulse < a.dataValues.pulse){
						return -1;
						}
						if(b.dataValues.pulse > a.dataValues.pulse){
						return 1;
						}
						if(b.dataValues.pulse === a.dataValues.pulse){
						return 0;
						}
					});

					
                                   if(query.hasOwnProperty('page')){

    						 offset = parseInt(query.page)*limit;   
                                   }
				       
                                 map.splice(limit+offset);
				     map.splice(0, offset);

       			res.json(map);
 			});

		
  		}, function(e) {
   			 res.status(500).json(e);
  		});

             
    }else{

  db.map.findAll({
    where: where,
  //  include: [{model: db.mapPulse}],
    limit: limit,
    offset: offset,
    order: order
  }).then(function(map) {

   res.json(map);
  }, function(e) {
    res.status(500).json(e);
  });
 }
  
});

app.get('/api/v1/maps', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    
   var user = req.user;

    var where = {
    $or: [
        {userId: user.id}, 
        {userId: 0},
        {userId: 1}

        ]
      };

    var limit = 10;
    var offset = 0;
    var order  = [['id', 'ASC']];
 
   if(query.hasOwnProperty('limit')){
	  limit = parseInt(query.limit);
   }

   if(query.hasOwnProperty('page')){
     offset = parseInt(query.page)*limit;
    }



  //  if (query.hasOwnProperty('stage')) {
  //    where.id = query.stage;
   //   offset = 0;
   //   limit = 1;
   //   order = [];
  //  }


    if(query.hasOwnProperty('orderBy')){

	
             db.map.findAll({
  		  where: where,
		 order: order
 		 }).then(function(map) {

		     var promises = map.map(function(m){
   			 return  m.getPulse().then(function(resp){
					m.dataValues.pulse = resp.length;	
     				});

			});

  		
 			return Promise.all(promises).then(function(){
					map.sort(function(a, b){
						if(b.dataValues.pulse < a.dataValues.pulse){
						return -1;
						}
						if(b.dataValues.pulse > a.dataValues.pulse){
						return 1;
						}
						if(b.dataValues.pulse === a.dataValues.pulse){
						return 0;
						}
					});

					
                                   if(query.hasOwnProperty('page')){

    						 offset = parseInt(query.page)*limit;   
                                   }
				       
                                 map.splice(limit+offset);
				     map.splice(0, offset);
				 
       				res.json(map);
 			});

		
  		}, function(e) {
   			 res.status(500).json(e);
  		});

             
    }else{
  db.map.findAll({
    where: where,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(map) {
    console.log('Find Maps..');
               var promises = map.map(function(m){
   			 return  m.getPulse().then(function(resp){
					m.dataValues.pulse = resp.length;	
     				});

			});

  		
 			return Promise.all(promises).then(function(){			 
       				res.json(map);
 			});

  }, function(e) {
    res.status(500).json(e);
  });
  }
  
});


app.get('/api/v1/mapsCount', middleware.requireAuthentication, function(req,res){
  var where = {};
  db.map.findAndCountAll({
    where: where
  }).then(function(map) {
    res.json(map.count);
  }, function(e) {
    res.status(500).json(e);
  });

  
});

app.get('/api/v1/mapStartFinish', middleware.requireAuthentication, function(req,res){


  var where = {};

  where.finishXtile =  {$ne: null};
   where.finishYtile =  {$ne: null}; 
	where.startXtile =  {$ne: null}; 
   where.startYtile =  {$ne: null}; 

  db.map.findAndCountAll({
    where: where
  }).then(function(maps) {
    res.json(maps);
  }, function(e) {
    res.status(500).json(e);
  });

  
});


app.get('/api/v1/map/:id', middleware.requireAuthentication, function(req,res){
   var mapId = parseInt(req.params.id, 10);
    db.map.findById(mapId).then(function(map){
        if(!!map){
            res.status(200).json(map.toJSON());
        }else{
            res.status(404).send();
        }
    },function(err){
            res.status(500).json(err);
    });
   
});


//DELETE /map/:id
app.delete('/api/v1/map/:id', middleware.requireAuthentication, function(req, res){
var mapId = parseInt(req.params.id, 10);
 
 db.map.findById(mapId).then(function(m){

  if(m.userId === parseInt(req.user.id)){
 db.map.findAll().then(function(arr){
if(arr.length>1){

  db.tile.destroy({where: {mapId: mapId}}); 

    db.map.destroy({where: {id: mapId}}).then(function(deleted){
         if(deleted){

         

          res.status(204).send();
         } else{
          res.status(404).json({error: 'No Map with id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 

}else{
   res.status(404).json({error: 'Cannont Delete The only MAP.'});
}

 });




  }else{

    res.status(401).json({error: 'Cannont Delete The only MAP.'});
  }


 });



 

});

//Post /Map
app.post('/api/v1/map', [bodyParser.json(), middleware.requireAuthentication], function(req, res){
var body = _.pick(req.body, 'mapname');
body.userId = req.user.id;
body.pulse = 0;
        db.map.create(body).then(function(map){   
             res.status(200).json(map.toJSON());
        },function(err){
            res.status(400).json(err);
        });

});

//Put /map/:id
app.put('/api/v1/map/:id', [bodyParser.json(), middleware.requireAuthentication], 
  function(req, res){
var mapId = parseInt(req.params.id, 10);

var body = _.pick(req.body, 'mapname', 'userId', 'startXtile', 'startYtile', 'finishXtile', 'finishYtile', 'mapIntro', 'startSquare', 'endSquare');
///Some Validation on the post.

 // mapIntro
 //  startSquare
 
 //  endSquare

  var attributes = {};
 
  if (body.hasOwnProperty('mapname')) {
    attributes.mapname = body.mapname;
  }

  if (body.hasOwnProperty('userId')) {
     attributes.userId = body.userId;
  }

  if(body.hasOwnProperty('startXtile') && body.hasOwnProperty('startYtile')) {
    attributes.startXtile = body.startXtile;
    attributes.startYtile = body.startYtile;
  }

  if(body.hasOwnProperty('finishXtile') && body.hasOwnProperty('finishYtile')) {
    attributes.finishXtile = body.finishXtile;
    attributes.finishYtile = body.finishYtile;
  }

    if (body.hasOwnProperty('mapIntro')) {
     attributes.mapIntro = body.mapIntro;
  }

    if (body.hasOwnProperty('startSquare')) {
     attributes.startSquare = body.startSquare;
  }

    if (body.hasOwnProperty('endSquare')) {
     attributes.endSquare = body.endSquare;
  }

  db.map.findById(mapId).then(function(map) {
    if (map && (map.userId === req.user.id || map.userId === 0)){
      map.update(attributes).then(function(map) {
        res.json(map.toJSON());
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
