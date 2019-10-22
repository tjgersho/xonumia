var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');


module.exports.controller = function(app) {


app.get('/api/v1/xoemail/:id', middleware.requireAuthentication, function(req,res){

   var xoemailId = parseInt(req.params.id, 10);

    db.xoemail.findById(xoemailId).then(function(email){
        if(!!email){
            res.status(200).text(email);
        }else{
            res.status(404).send();
        }
    },function(err){
            res.status(500).json(err);
    });
   
});



};