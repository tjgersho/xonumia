
//MANAGE CURRENT PLAYER CREATE READ UPDATE DELETE on SERVER>!
var db = require('../db.js');

currentXnumsCRUD = {};
///Create////

currentXnumsCRUD.create = function(locX, locY, valDollar){
  var newXnum = {locX: locX, locY: locY, valDollar: valDollar};
     
     return new Promise(function(resolve, reject){
          db.xnum.create(newXnum).then(function(xnum){   
             resolve(xnum.toJSON());
          },function(err){
            reject(err);
          });
	});
};




//READ///
currentXnumsCRUD.read = function(query){
    
   var where = {};
   where.found = false;

  if (query.hasOwnProperty('locX') && query.hasOwnProperty('locY')) {
    where.locX = {$gte: parseInt(query.locX)-100, $lte: parseInt(query.locX)+100};
    where.locY = {$gte: parseInt(query.locY)-100, $lte: parseInt(query.locY)+100};
  }

return new Promise(function(resolve, reject){

   db.xnum.findAll({
     where: where
   }).then(function(xnum) {
     resolve(xnum.toJSON());
   }, function(e) {
     reject(e);
 
   });

 });

};

//READ///
currentXnumsCRUD.readById = function(id){

return new Promise(function(resolve, reject){
    db.xnum.findById(id).then(function(xnum){
        if(!!xnum){
           resolve(xnum.toJSON());
        }else{
           reject();
        }
    },function(err){
            reject(err);
    });

 });


};





//UPDATE///

currentXnumsCRUD.update = function(updateXnum){
      //updateXnum must have id of Xnum...
  return new Promise(function(resolve, reject){

  //Some Validation on the post.

  var attributes = {};

  if (updateXnum.hasOwnProperty('locX')) {
    attributes.locX = updateXnum.locX;
  }
  if (updateXnum.hasOwnProperty('locY')) {
    attributes.locY = updateXnum.locY;
  }

   if (updateXnum.hasOwnProperty('valDollar')) {
    attributes.valDollar = updateXnum.valDollar;
  }


  db.xnum.findById(updateXnum.id).then(function(xnum) {
    if (xnum) {
      xnum.update(attributes).then(function(xnum) {
         resolve(xnum.toJSON());
      }, function(e) {
        reject(e);
      });
    } else {
     reject();
    }
   }, function() {
    reject();
   });

  });


};


//DELETE//

currentXnumsCRUD.delete = function(id){
return new Promise(function(resolve, reject){

  db.xnum.destroy({where: {id: xnumId}}).then(function(deleted){
         if(deleted){
           resolve();
         } else{
          reject({error: 'No xnum with id'});
         }
      },function(err){
          reject(err);
   }); 
 });
};


module.exports.currentXnumsCRUD = currentXnumsCRUD;


