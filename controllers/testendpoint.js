var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');

var AWS = require('aws-sdk'); 

var uuid = require('node-uuid'); 


module.exports.controller = function(app) {


app.get('/api/v1/test',  function(req,res){

 


var s3 = new AWS.S3();

var myBucket = 'xonumiaTest';
var myKey = 'Hello World AWS SDK';

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     params = {Bucket: myBucket, Key: myKey,  Body: 'Hello!'};

     s3.putObject(params, function(err, data) {

         if (err) {

             console.log(err)

         } else {

             console.log("Successfully uploaded data to myBucket/myKey");

         }

      });

   }

});


});



};