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


var adminTable = [];

adminTable[0] = {};	
adminTable[0]['keyname'] = 'addXbit';
adminTable[0]['valuestring'] = '{"action": false, "qty": 50}';

adminTable[1] = {};
adminTable[1]['keyname'] = 'addXnum';
adminTable[1]['valuestring'] = '{"action": false, "qty": 5}';



  var result = [];

  var promises = adminTable.map(function(admn){
	

   return  db.admin.create(admn).then(function(admn){

      result.push({adinHash: admn, success: true});

   }).catch(function(err){

      result.push({success: false});
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
     return db.admin.destroy({where: {id:{$not: -1}}});
  }
};
