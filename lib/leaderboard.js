var db = require('../db.js');

//LeaderBoard Class
class leaderboard{

  constructor(){
	this.users = this.getAllUsers();
  }
 
  getAllUsers(){
	var self = this;
	db.user.findAll({include: [{model: db.xnum}]}).then(function(users){
		
		var u_xbit_array = users.map(function(u){	
			 return {username: u.dataValues.username, xBits: u.xBits, xNums: u.xnums.length};	
              });
		
          self.users =  u_xbit_array;
	 });
  } 
  refreshLeaderBoardAllUserArray(){
	this.getAllUsers();
  }
  refreshSingleUserinUsersArray(username){
		var self = this;
		return new Promise(function(resolve, reject){
				  db.user.find({where:{username: username},include: [{model: db.xnum}]}).then(function(usr){
		var lenUsers = self.users.length;
		
            for (var i = 0; i< lenUsers; i++){

		     if(self.users[i].username === username){
			      self.users[i].xBits = usr.xBits;
			      self.users[i].xNums = usr.xnums.length;
			      resolve('LeaderBoard Refreshed!');
                 }

 
            }	
            reject('User Not Found');	 
	    });

	  });
	  
       
    }
  getXbitOrderedArray(){

	var ordered_xbit_array = this.users.sort(function(a,b){
			return b.xBits - a.xBits;
		  });
	return ordered_xbit_array;

  }
 
   getXnumOrderedArray(){

	var ordered_xnum_array = this.users.sort(function(a,b){
			return b.xNums - a.xNums;
		  });
	return ordered_xnum_array;

  }
  
}


module.exports = leaderboard;
