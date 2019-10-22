'use strict';
var db = require('../db.js');
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */


      var maps = [];

   

      for(var j=0; j<30; j++){
        maps[j] = {mapname: '', userId: 1};
      }
      var result = [];

var promises = maps.map(function(newmap){

   return  db.map.create(newmap).then(function(map){

      result.push({map: map, success: true});

   }).catch(function(err){
      result.push({map:map, success: false});
      return Promise.resolve();
   });

});

  
 return Promise.all(promises).then(function(){
        return Promise.resolve(result);
 });
   
   

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    // return db.map.destroy({where: {id:{$not: 1}}});
      return db.map.destroy({where: {}});
  }
};
