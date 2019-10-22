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

  var users = [];

        users[0] = {username: 'a', email: 'a@a.com', password: '123123', role: 0};
        users[1] = {username: 'b', email: 'b@b.com', password: '123123', role: 0};
        users[2] = {username: 'c', email: 'c@c.com', password: '123123', role: 0};
        users[3] = {username: 'd', email: 'd@d.com', password: '123123', role: 0};
        users[4] = {username: 'e', email: 'e@e.com', password: '123123', role: 0};
        users[5] = {username: 'f', email: 'f@f.com', password: '123123', role: 0};
        users[6] = {username: 'g', email: 'g@g.com', password: '123123', role: 0};
    
      var result = [];

var promises = users.map(function(newuser){

   return  db.user.create(newuser).then(function(usr){

      result.push({user: usr, success: true});

   }).catch(function(err){

      result.push({user: usr, success: false});
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

    return db.user.destroy({where: {id:{$not: -1}}});
    
  }
};
