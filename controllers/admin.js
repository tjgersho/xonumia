var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');

 var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false});


module.exports.controller = function(app) {

var getRedColor = function(){
     return Math.floor((Math.random() * 255) + 1);
  };

  var getGreenColor = function(){
     return Math.floor((Math.random() * 255) + 1);
  };

  var getBlueColor = function(){
    return Math.floor((Math.random() * 255) + 1);

  };

  var getTransAmount = function(){
     return Math.random();

  };
 var someMethodColor = function(x, y, minX, maxX, minY, maxY){
  	var rx = maxX - minX;
	var ry = maxY - minY;
	var r = (rx + ry) / 2;
	var pos = Math.sqrt(Math.pow((x - minX),2) + Math.pow((y - minY),2))/r;
	var val = 255 * pos;
        if(val > 255){
          val = 255;
	}
    return val;
 };

 

//Post /comment       urlencodedParser,
app.post('/api/v1/admin/buildLevel', [bodyParser.json(), middleware.adminOnly], function(req, res){
var body = _.pick(req.body, 'level', 'minX', 'maxX', 'maxY', 'minY');
console.log('Build LEVEL ');
var mapId = body.level;

      var result = [];
      var promises = [];

db.map.find({where: {id: mapId}}).then(function(map){
          if(!!map && (map.userId === req.user.id || map.userId === 0) ){
	
           map.minX = body.minX;
           map.maxX = body.maxX;
           map.minY = body.minY-1;
	    map.maxY = body.maxY-1;
           map.save();

                            
                                          


      for(var i=map.minX; i<map.maxX; i++){
	for(var j=map.minY; j<map.maxY; j++){

      //  var rand_color_r = getRedColor();
      //  var rand_color_g = getGreenColor();
      //  var rand_color_b = getBlueColor();
      //  var rand_trans   = getTransAmount();
       
        var rand_color_r = someMethodColor(i, j, map.minX, map.maxX, map.minY, map.maxY); //getRedColor();
        var rand_color_g = someMethodColor(i, j, map.minX, map.maxX, map.minY, map.maxY); //getGreenColor();
        var rand_color_b = someMethodColor(i, j, map.minX, map.maxX, map.minY, map.maxY); //getBlueColor();
	 var rand_trans   = 0.8;

	

        var randZerotoThree = Math.floor((Math.random() * 5));
	

	
   var tileBody =  {'locX': i+0.5, 
	     'locY': j-0.5, 
	     'gu': randZerotoThree === 0,
	     'gr': randZerotoThree === 1,
	     'gd': randZerotoThree === 2,
	     'gl': randZerotoThree === 3,
	     'color_r': rand_color_r,
	     'color_g': rand_color_g,
	     'color_b': rand_color_b,
	     'color_a': rand_trans,
	  };
        

	   promises.push(              
                  db.tile.create(tileBody).then(function(tile){
                       tile.setMap(map).then(function(tile){
                              result.push({tile: tile, success: true});
                        });
                    }).catch(function(err){
                        result.push({success: false});
                        return Promise.resolve();
                    })
               );

          
        }
      }

    console.log(promises);

    
    Promise.all(promises).then(function(){
         res.json(Promise.resolve(result));
   });
   

  }else{
       res.status(404).send();
  }

},function(err){
    res.status(400).json(err);
});

   
      
});





app.get('/api/v1/admin/keyvals',  middleware.adminOnly, function(req, res){
console.log('AdminKeyVals');


  db.admin.findAll({where:{}}).then(function(admn){

          res.json(admn);
  
     },function(err){
          res.status(400).json(err);
    });


   
});



};
