var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var cryptojs = require('crypto-js');
var bodyParser = require('body-parser');

module.exports.controller = function(app) {

app.post('/api/v1/users/findByToken',  bodyParser.json(),  function(req, res){
 var body = _.pick(req.body, 'token');

  var token = body.token;
    db.token.findOne({
          where: {
             tokenHash: cryptojs.MD5(token).toString()
           }
        }).then(function (tokenInstance) {
          if (!tokenInstance) {
             res.status(401).json("Token Not Found");
          }
           
          req.token = tokenInstance;

          db.user.findByToken(token).then(function(resp){

              res.status(200).json(resp.toPublicJSON());
            },function(err){

             res.status(401).json(err);
          });
      });
});

app.get('/api/v1/userxbit',  [bodyParser.json(), middleware.requireAuthentication], function(req, res) {
	 res.status(200).json(req.user);
    });

app.get('/api/v1/userNumXnum', [middleware.requireAuthentication], function(req, res){
	
 var where = {userId: req.user.id};
  db.xnum.findAndCountAll({
    where: where
   }).then(function(xnum) {
    res.json(xnum.count);
   }, function(e) {
    res.status(500).json(e);
  });

});

app.get('/api/v1/userValXnum', [middleware.requireAuthentication], function(req, res){
	
var where = {userId: req.user.id};
  db.xnum.findAll({
    where: where
  }).then(function(xnum) {
	var val = 0;

    xnum.forEach(function(x){
		val += x.valDollar;
	});

	res.json(val);
  }, function(e) {
    res.status(500).json(e);
  });

});

app.get('/api/v1/userAvailValXnum', [middleware.requireAuthentication], function(req, res){
	
var where = {userId: req.user.id, payRequested: false, paid: false};
  db.xnum.findAll({
    where: where
  }).then(function(xnum) {
	var val = 0;

    xnum.forEach(function(x){
		val += x.valDollar;
	});

	res.json(val);
  }, function(e) {
    res.status(500).json(e);
  });

});



app.post('/api/v1/users',  bodyParser.json(),  function(req, res){
 var body = _.pick(req.body, 'username', 'email', 'password');

      body.role = 0;
        db.user.create(body).then(function(user){   
             res.status(200).json(user.toPublicJSON());
        },function(err){
            res.status(400).json(err);
        });
});



app.put('/api/v1/users',  [bodyParser.json(), middleware.requireAuthentication],  function(req, res){
  var user = req.user;
     console.log('UPDATE COLOR --- USER ');
	console.log(req.user);
	console.log(user);

var body = _.pick(req.body, 'bodyColorR', 'bodyColorG', 'bodyColorB', 'bodyColorA', 'borderColorR', 'borderColorG', 'borderColorB', 'borderColorA');
///Some Validation on the post.

  var attributes = {};

  if (body.hasOwnProperty('bodyColorR')) {
    attributes.bodyColorR = body.bodyColorR;
  }
   if (body.hasOwnProperty('bodyColorG')) {
    attributes.bodyColorG = body.bodyColorG;
  }
  if (body.hasOwnProperty('bodyColorB')) {
    attributes.bodyColorB = body.bodyColorB;
  }
  if (body.hasOwnProperty('bodyColorA')) {
    attributes.bodyColorA = body.bodyColorA;
  }

   if (body.hasOwnProperty('borderColorR')) {
    attributes.borderColorR = body.borderColorR;
  }
   if (body.hasOwnProperty('borderColorG')) {
    attributes.borderColorG = body.borderColorG;
  }
   if (body.hasOwnProperty('borderColorB')) {
    attributes.borderColorB = body.borderColorB;
  }
   if (body.hasOwnProperty('borderColorA')) {
    attributes.borderColorA = body.borderColorA;
  }

  db.user.findById(user.id).then(function(usr) {
    if (!!usr) {
      usr.update(attributes).then(function(usr) {
        res.json(usr.toJSON());
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




app.post('/api/v1/users/login',  bodyParser.json(),  function (req, res) {
  var body = _.pick(req.body, 'email_or_username', 'password');
  console.log(body);
  var userInstance;

  db.user.authenticate(body).then(function (user) {

    var token = user.generateToken('authentication');

    userInstance = user;

    return db.token.create({
      token: token
    });
  }).then(function (tokenInstance) {
     res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
  }).catch(function () {
    res.status(401).send();
  });
});

// DELETE /users/login
app.delete('/api/v1/users/login', [bodyParser.json(), middleware.adminOnly], function (req, res) {
  req.token.destroy().then(function () {
    res.status(204).send();
 }).catch(function () {
    res.status(500).send();
 });
});

};