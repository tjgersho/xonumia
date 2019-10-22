var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');


module.exports.controller = function(app) {

app.get('/api/v1/subscribe', middleware.adminOnly, function(req,res){
 
   var query  = req.query;
    

  var user = req.user;
  var byStatus;
   if(query.hasOwnProperty('byStatus')){
       byStatus  = parseInt(query.byStatus,10);
    }

    var where = {
        status: byStatus
      };

 
    var limit = 10;
    var offset = 0;
    var order  = [['id', 'ASC']];

   if(query.hasOwnProperty('page')){
     offset = query.page*10;
    }

   if(query.hasOwnProperty('orderBy')){
       order  = [['pulse', 'DESC']];
    }

  db.subscribe.findAll({
    where: where,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(map) {
    res.json(map);
  }, function(e) {
    res.status(500).json(e);
  });

  
});




};