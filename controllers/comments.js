var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');

 var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false});


module.exports.controller = function(app) {

app.get('/api/v1/comments', middleware.adminOnly, function(req,res){
 
   var query  = req.query;
    

  var user = req.user;
  var byStatus;

   var where = {};

   if(query.hasOwnProperty('byStatus')){
       byStatus  = parseInt(query.byStatus,10);
       where.status  =  byStatus;
    }



 
    var limit = 10;
    var offset = 0;
    var order  = [['id', 'ASC']];

   if(query.hasOwnProperty('page')){
     offset = query.page*10;
    }

   if(query.hasOwnProperty('orderBy')){
       order  = [['pulse', 'DESC']];
    }

  db.comment.findAll({
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




app.get('/api/v1/comments/:id', middleware.adminOnly, function(req,res){
   var commentId = parseInt(req.params.id, 10);
    db.comment.findById(commentId).then(function(cmt){
        if(!!cmt){
            res.status(200).json(cmt.toJSON());
        }else{
            res.status(404).send();
        }
    },function(err){
            res.status(500).json(err);
    });
   
});


//DELETE /comment/:id
app.delete('/api/v1/comments/:id', middleware.adminOnly, function(req, res){
 var commentId = parseInt(req.params.id, 10);

  db.comment.destroy({where: {id: commentId}}).then(function(deleted){
         if(deleted){
          res.status(204).send();
         } else{
          res.status(404).json({error: 'No tile with id'});
         }
      },function(err){
         res.status(500).json(err);
   }); 



 

});

//Post /comment       urlencodedParser,
app.post('/api/v1/comments', bodyParser.json(), function(req, res){
var commentbody = _.pick(req.body, 'name', 'email', 'comment');
console.log('POST COMMENT ');


      if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
          return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
        }

        console.log(req.body['g-recaptcha-response']);
        // Put your secret key here.
        var secretKey = "6LflqQsUAAAAAM8mukqhgn2Ciwwi_oQvNtNfQjfd";
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl,function(error,response,body) {
          body = JSON.parse(body);
          // Success will be true or false depending upon captcha validation.
          if(body.success !== undefined && !body.success) {
            return res.status(404).json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
          }

            db.comment.create(commentbody).then(function(comment){   
                 res.status(200).json(comment.toJSON());
            },function(err){
                res.status(400).json(err);
            });


        });


      
});



};
