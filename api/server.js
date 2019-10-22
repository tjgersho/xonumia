//server.js
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var http = require('http').Server(app);
var env = process.env.NODE_ENV || 'development';
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var moment = require("moment");


var PORT = process.env.PORT || 3000;

var isAmazon = process.env.USER === 'ubuntu' ? true : false;
if(isAmazon){
PORT = 8080;
}

app.get('/healthcheck', function (req, res) {
  res.send('Healthy!')
});


var io = require('socket.io')(http);

var SAT = require('sat');

var middleware = require(__dirname +'/middleware.js')(db);

var currentPlayerCRUD = require('./lib/currentPlayerCRUD.js');

var currentXnumCRUD = require('./lib/currentXnumCRUD.js');

// Import utilities.
var util = require('./lib/util.js');

var gameconfig = require('./config.json');

var lb = require('./lib/leaderboard.js');
var leaderboard = new lb();
leaderboard.getAllUsers();


app.use(express.static(__dirname + '/cdn'));

var path = require('path');
var fs = require('fs');




app.set('views', __dirname + '/views');


app.set('view engine', 'pug');



// Import quadtree.
var quadtree = require('simple-quadtree');

var tree = quadtree(0, 0, gameconfig.gameWidth, gameconfig.gameHeight);
 

var routes = require('./routes');

//app.get('/', function(req, res){
  //res.sendFile('index.html');
 //  res.render('layout/layout');
   //res.send("TEST");
//});
 
//var domain = 'xonumia.com';
//var mailgun = require('mailgun-js')({apiKey: mailGun_api_key, domain: domain});
 
//var data = {
//  from: 'Excited User <me@samples.mailgun.org>',
//  to: 'travis.g@paradigmmotion.com',
//  subject: 'Hello',
//  text: 'Testing some Mailgun awesomness!'
//  html: '<h1>Testing some Mailgun awesomness!</h1>'
//};
 
//mailgun.messages().send(data, function (error, body) {
//  console.log(body);
//});

var XOMatrix = require('./Matrix.js');


app.get('/partials/:filename', routes.partials);

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
 if(file.substr(-3) == '.js') {
	    require('./controllers/' + file).controller(app);
 }
});


app.use(routes.index);

if(PORT === 3000){
//db.sequelize.sync({force: true, logging: null}).then(function() { 
db.sequelize.sync().then(function() { 
  http.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
    // exec('sequelize db:seed:all', function(err, stdout, stderr){
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + stderr);
    //     if(err !== null){
    //         console.log('exec error: ' + err);
    //     }
    // });
  });
}, function(err){console.log(err);});
}else{
db.sequelize.sync().then(function() { 
  http.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
    // exec('sequelize db:seed:all', function(err, stdout, stderr){
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + stderr);
    //     if(err !== null){
    //         console.log('exec error: ' + err);
    //     }
    // });
  });
}, function(err){console.log(err);});
}

function fillplayerTileMap(currentPlayer){
return new Promise(function(resolve, reject) {
   // try {

          var where = {};

    where.locX = {$gte: currentPlayer.x-3*currentPlayer.screenCellsWidth, $lte: currentPlayer.x+3*currentPlayer.screenCellsWidth};
    where.locY = {$gte: currentPlayer.y-3*currentPlayer.screenCellsHeight, $lte: currentPlayer.y+3*currentPlayer.screenCellsHeight};
   
   var include = [];

           db.map.findById(parseInt(currentPlayer.level)).then(function(map){
              console.log('Tile Get map ID and user ID');
              console.log(map.userId);
           
              include[0] = {
                    model: db.map, 
                    where: 
                           {
                            id: parseInt(currentPlayer.level)
                           }
                     
                    };

                     db.tile.findAll({
                          where: where,
                          include: include
                        }).then(function(tiles) {

				currentPlayer.map.tiles = tiles;
                         
					console.log('Tiles Found');
					console.log(tiles.length);
					

                         tiles.forEach(function(t){
                           
                            var ti = {x: t.locX, y: t.locY, w:1, h:1, gu: t.gu, gr: t.gr, gd: t.gd, gl: t.gl};
                            currentPlayer.maptree.put(ti);
                             
				});
				  resolve("Map Filled");

                        }, function(e) {
				reject();
                        });

                      

                   },function(err){
				reject();
		 });
   
    //}catch(e){
    //  reject();
   // }

});

}

function userByToken(token){
    console.log('TOKEN IN USER BY TOKEN ' + token);

return new Promise(function(resolve, reject) {
    try {
        db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function (tokenInstance) {
                if (!tokenInstance) {
                    throw new Error();
                }

		return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
						
						db.user.findOne({where: {id: tokenData.id}, include:[db.xnum]}).then(function (user) {
							console.log('USER in Find ONE');
							console.log(user);
							if (!!user) {
								resolve(user);
							} else {
								reject('WTFffff');
							}
						}, function (e) {
							console.log(e);
							reject('WTF');
						});
					} catch (e) {
						console.log(e);
							reject('TRY WTF');
					}
				});

            }).then(function (user) {
                console.log("USER BY TOKEN USER " + user);
                if (user) {
                                resolve(user);
                            } else {
                                reject();
                            }
            }).catch(function () {
                reject('User Not Found');
            });
   }catch(e){
    reject();
   }
    
});

}


function  screenLevel(level, usrId){
console.log('Level Play Request...' + level);

return new Promise(function(resolve, reject) {
    try {
        db.map.findOne({where:{id: level}}).then(function(map){
		console.log('Map in level Request..');
              console.log('Map in level Request..');
		console.log('Map in level Request..');
		console.log('Map in level Request..');
		console.log(map.userId);
                if (map.userId === usrId || map.userId === 0 || map.id<=30) {
                     resolve(level);
                }else{
                   resolve(1);

                }
                console.log('Token is in Database');
            }).catch(function () {
                resolve('1');
            });
   }catch(e){
    resolve('1');
   }
    
});


}

var users = [];
//var massFood = [];
var xnum = [];
var xnumtree = quadtree()

db.xnum.findAll({where:{found: false}}).then(function(xs){

	xs.forEach(function(x){
	 xnum.push({id: x.id, locX: x.locX, locY: x.locY, level: x.level});
	 var ti = {id: x.id, x: x.locX, y: x.locY, w:1, h:1,  level: x.level};
	 xnumtree.put(ti);
	});

 },function(err){
	console.log('Get Xnum on Server bootup Error');
	console.log(err);
});



var xbit = [];
var xbittree = quadtree();

var sockets = {};


var xbitleaderboardChanged = true;
var xnumleaderboardChanged = true;

var V = SAT.Vector;
var C = SAT.Circle;


io.on('connection', function (socket) {
    console.log('A user connected!');
    console.log('User ID: ' + socket.handshake.query.userId);
   
	
    var radius = gameconfig.defaultPlayerRadius;

   // var position = gameconfig.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(users, radius) : util.randomPosition(radius);
    //db.user.findOne({where: {id: socket.handshake.query.userId}}).then(function(user){
     ///       console.log('FIND ONE In Server! ... ');
      //      console.log(user);
    //});


    //var xnumVal = db.user.findByxnumVal;
	
  
	var currentPlayer = {
        id: socket.id,
	 userId: -1,
        x: 0.5,
        y: 0.5,
        cellX: 0.5,
        cellY: 0.5,
        radius: radius,
        w: 2 * radius,
        h: 2 * radius,
	 playerConfig: {
   		 border: 2,
    	        textColor: '#FFFFFF',
    		 textBorder: '#000000',
               textBorderSize: 3,
    		 defaultSize: 30,
		 bodyColorR: 255,
		 bodyColorG: 0,
               bodyColorB: 0,
               bodyColorA: 0.8,
 		 borderColorR: 0,
		 borderColorG: 255,
               borderColorB: 0,
               borderColorA: 0.8
	},
        lastHeartbeat: Date.now(),
        moveArray: [],
        processedMoves: [],
	 map: {},
	 xnums: [],
	 xNumsVal: function(){
		var value = 0
		for(var i=0; i<currentPlayer.xnums.length; i++){
			value = value + currentPlayer.xnums[i].valDollar;
		}
		return value.toFixed(2);
	 },
	 xbits: 0,
        cellMoves: {
            l: false,
            u: false,
            r: false,
            d: false
        },
        target: {x:0, y:0},
        levelBounds: [],
        level: socket.handshake.query.level,
        speed: 0,
        foundFinish: false,
	 hasAllThreeFlags: false
    };

     
    

 

    socket.on('logout', function (player) {
        console.log("SOCKET LOGOUT");
        console.log("USRS" , users);
        console.log("PLAYER", player);
       if (util.findIndex(users, player.id) > -1){
            users.splice(util.findIndex(users, player.id), 1);
        }
        console.log(users);
        socket.disconnect();
    });

    socket.on('gotit', function (player) {
        	console.log('[INFO] Player ' + player.name + ' connecting!');
		console.log(currentPlayer.id);
	
        userByToken(player.token).then(function(usr){
            currentPlayer.userId = usr.id;
   		console.log("USER BY TOKEN");
		console.log(usr);
            var radius = gameconfig.defaultPlayerRadius;

            //var position = gameconfig.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(users, radius) : util.randomPosition(radius);

            currentPlayer.lastHeartbeat = Date.now();            
            currentPlayer.screenWidth = player.screenWidth;
	     currentPlayer.screenHeight = player.screenHeight;
            currentPlayer.screenCellsWidth = player.screenCellsWidth;
	     currentPlayer.screenCellsHeight = player.screenCellsHeight;
	     currentPlayer.token = player.token;
	     currentPlayer.name = player.name;
	     currentPlayer.playerConfig =  {
   					 border: 2,
    	       			 textColor: '#FFFFFF',
    					 textBorder: '#000000',
              			 textBorderSize: 3,
    					 defaultSize: 30,
					 bodyColorR: usr.bodyColorR,
					 bodyColorG: usr.bodyColorG,
              			 bodyColorB: usr.bodyColorB,
              			 bodyColorA: usr.bodyColorA,
 					 borderColorR: usr.borderColorR,
		 			 borderColorG: usr.borderColorG,
              			 borderColorB: usr.borderColorB,
               			 borderColorA: usr.borderColorA
					},

	     currentPlayer.xnums = usr.xnums;
	     currentPlayer.xnumsLength = usr.xnums.length;
	     currentPlayer.xnumsVal = currentPlayer.xNumsVal();
	     currentPlayer.xbits = usr.xBits;

            console.log('Total players: ' + users.length);
	     console.log('LEVEL.. ' + currentPlayer.level);
	     console.log('Level from Player passed in..' + player.level);
	///Check if level is playable..

	 screenLevel(player.level, currentPlayer.userId).then(function(level){
		console.log('LEvel from Screen Level');
		console.log(level);
	       currentPlayer.level = level;

            db.map.findOne({where:{id: currentPlayer.level}}).then(function(map){
		
		currentPlayer.map.startXtile = map.startXtile;
		currentPlayer.map.startYtile = map.startYtile;

		if(map.startXtile !== null && map.startXtile !== undefined && map.startYtile !== null && map.startYtile !== undefined){
			console.log("---------------IN NEW START!!!-----------------");
			console.log(map.startXtile);
			currentPlayer.x =  map.startXtile;
       		currentPlayer.y = map.startYtile;
       		currentPlayer.cellX =  map.startXtile;
        		currentPlayer.cellY = map.startYtile;
		
              }
	
		currentPlayer.map.finishXtile = map.finishXtile;
		currentPlayer.map.finishYtile = map.finishYtile;

		currentPlayer.map.mapIntro = map.mapIntro;
		currentPlayer.map.startSquare = map.startSquare;
		currentPlayer.map.endSquare = map.endSquare;
		currentPlayer.hasAllThreeFlags = false;

              currentPlayer.levelBounds = [map.maxY, map.maxX, map.minY, map.minX];
                currentPlayer.maptree = quadtree(
                                         map.minX, 
                                            map.maxY, 
                                               (map.maxX-map.minX), 
                                               (map.maxY-map.minY));
			
		playerViewBoundBufferThreasholdReset(currentPlayer);		


                fillplayerTileMap(currentPlayer).then(function(rs){

    			console.log('Fill PLAYER TILE MAP');
			console.log(rs);
		

			 if (util.findUserId(users, currentPlayer.userId) > -1) {
			       console.log('[INFO] Player ID is already connected.');
                	 	console.log('USERS ARRAY');
                     	console.log(users);
		              users.splice(util.findIndex(users, currentPlayer.userId), 1);
                      	sockets[currentPlayer.id] = socket;
                      	users.push(currentPlayer);
			 } else {
                      	console.log('[INFO] Player ' + player.name + ' connected!');
	               	// console.log(sockets);
                      	console.log(currentPlayer.id);
                      	sockets[currentPlayer.id] = socket;
                      	users.push(currentPlayer);
			 }

                    console.log('USERS ARRAY');
                    console.log(users);

                    xbitleaderboardChanged = true;
		      xnumleaderboardChanged = true;
                    socket.emit('startGame', currentPlayer);

				},function(err){
				console.log("ERROR FILLING USER MAP ARRAY and QUADTREE");
				console.log(err);
				});
         
              }); //  get Map.
			  
	      });  // Screen Level

            },function(err){
                 console.log('Could Not Find User by Token in the gotit socket function');
                 console.log(err);
                 socket.disconnect();
         });    // End Get User

       
    }); // End Socket Got it

    socket.on('windowResized', function (data) {
        currentPlayer.screenWidth = data.screenWidth;
        currentPlayer.screenHeight = data.screenHeight;
	 currentPlayer.screenCellsWidth = data.screenCellsWidth;
	 currentPlayer.screenCellsHeight = data.screenCellsHeight;
	 console.log(' ');
	 console.log(' ');
	 console.log(' ');
	 console.log('Current Player in window Resized');
	 console.log(currentPlayer);
    });

    socket.on('spawn', function (replayer) {
        if (util.findIndex(users, currentPlayer.id) > -1){
            users.splice(util.findIndex(users, currentPlayer.id), 1);
        }
        console.log('-----------------RESPAWN--------------- ', replayer);
        console.log('respawn current player variable ');
	 console.log(currentPlayer);
        currentPlayer.movePlayer = [];
	 currentPlayer.foundFinish = false;
        socket.emit('welcome', currentPlayer);
        console.log('[INFO] User respawned!');

    });

    socket.on('disconnect', function () {
        if (util.findIndex(users, currentPlayer.id) > -1)
            users.splice(util.findIndex(users, currentPlayer.id), 1);
        console.log('[INFO] User ' + currentPlayer.name + ' disconnected!');

        socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
    });
	
    socket.on('resetPos', function(){
        console.log('Reset Player Position');
        console.log(currentPlayer);
	currentPlayer.x = 0.5;
	currentPlayer.y = 0.5;
	currentPlayer.cellX = 0.5;
	currentPlayer.cellY = 0.5;
	currentPlayer.speed = 0;
	currentPlayer.processedMoves = [];
	currentPlayer.moveArray = [];
        currentPlayer.foundFinish = false;

    });
  
  socket.on('foundAllFlags', function(data){
        console.log('FOUND ALL THREE FLAGS');
        console.log('PLAYER', data);
 
	var pwhofound = null;
	var userArrlen = users.length;
  	 for (var i=0; i<userArrlen; i++){
		if(users[i].id === data.player.id){
		   var pwhofound = users[i];
		}
          }

         if(!!pwhofound){
	   
        pwhofound.hasAllThreeFlags = true;
		
         }else{
          console.log("PLAYER WHO FOUND FLAGS LEVELS WAS NOT FOUND IN USER ARRAY");
            
           socket.disconnect();

	 }

               

  });
    

    socket.on('changeLevel', function(data){
        console.log('LEVEL CHANGED');
        console.log('PLAYER', data.player);
        console.log('LEvel', data.level);
	var pwhochanged = null;
	var userArrlen = users.length;
  	 for (var i=0; i<userArrlen; i++){
		if(users[i].id === data.player.id){
		   var pwhochanged = users[i];
		}
          }

         if(!!pwhochanged){
           pwhochanged.level = data.level;
		pwhochanged.x = 0.5;
		pwhochanged.y = 0.5;
		pwhochanged.cellX = 0.5;
		pwhochanged.cellY = 0.5;
		pwhochanged.speed = 0;
		pwhochanged.processedMoves = [];
		pwhochanged.moveArray = [];
              pwhochanged.foundFinish = false;
 		pwhochanged.hasAllThreeFlags = false;

             socket.emit('levelChangeWelcome', currentPlayer);
	 
         }else{
          console.log("PLAYER WHO CHANGED LEVELS WAS NOT FOUND IN USER ARRAY");
            
           socket.disconnect();

	 }
               

    });
	
     

    socket.on('playerChat', function(data) {
        var _sender = data.sender.replace(/(<([^>]+)>)/ig, '');
        var _message = data.message.replace(/(<([^>]+)>)/ig, '');
        if (gameconfig.logChat === 1) {
            console.log('[CHAT] [' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + '] ' + _sender + ': ' + _message);
        }
        socket.broadcast.emit('serverSendPlayerChat', {sender: _sender, message: _message.substring(0,35)});
    });

    socket.on('pass', function(data) {
        if (data[0] === gameconfig.adminPass) {
            console.log('[ADMIN] ' + currentPlayer.name + ' just logged in as an admin!');
            socket.emit('serverMSG', 'Welcome back ' + currentPlayer.name);
            socket.broadcast.emit('serverMSG', currentPlayer.name + ' just logged in as admin!');
            currentPlayer.admin = true;
        } else {
            console.log('[ADMIN] ' + currentPlayer.name + ' attempted to log in with incorrect password.');
            socket.emit('serverMSG', 'Password incorrect, attempt logged.');
            // TODO: Actually log incorrect passwords.
        }
    });

     socket.on('advHasInterest', function(data) {
		console.log('ADV HAS INTEREST');
		console.log(data);
              socket.broadcast.emit('setAdvHasInterest', data);
		db.adv.find({where:{id:data.advId}}).then(function(adv){
		
			adv.update({'sponsorshipInterest': true}).then(function(adv){
				console.log('SponsorShipInterest Set to False');
				console.log(adv);

			},function(err){
				console.log('SponsorShipInterest Set to FaLSE UPDATE ERR');
				console.log(err);

			});

   		 },function(err){
			console.log('Could Not Find the ad by the id');
			console.log(err);
   		 });

		resetAdvIfPurchaseDidNotGoThru(data.advId)
       });


    socket.on('kick', function(data) {
        if (currentPlayer.admin) {
            var reason = '';
            var worked = false;
            for (var e = 0; e < users.length; e++) {
                if (users[e].name === data[0] && !users[e].admin && !worked) {
                    if (data.length > 1) {
                        for (var f = 1; f < data.length; f++) {
                            if (f === data.length) {
                                reason = reason + data[f];
                            }
                            else {
                                reason = reason + data[f] + ' ';
                            }
                        }
                    }
                    if (reason !== '') {
                       console.log('[ADMIN] User ' + users[e].name + ' kicked successfully by ' + currentPlayer.name + ' for reason ' + reason);
                    }
                    else {
                       console.log('[ADMIN] User ' + users[e].name + ' kicked successfully by ' + currentPlayer.name);
                    }
                    socket.emit('serverMSG', 'User ' + users[e].name + ' was kicked by ' + currentPlayer.name);
                    sockets[users[e].id].emit('kick', reason);
                    sockets[users[e].id].disconnect();
                    users.splice(e, 1);
                    worked = true;
                }
            }
            if (!worked) {
                socket.emit('serverMSG', 'Could not locate user or user is an admin.');
            }
        } else {
            console.log('[ADMIN] ' + currentPlayer.name + ' is trying to use -kick but isn\'t an admin.');
            socket.emit('serverMSG', 'You are not permitted to use this command.');
        }
    });

    // Heartbeat function, update everytime.
    socket.on('0', function(moveUpdates) {

        currentPlayer.lastHeartbeat = Date.now();
        if (moveUpdates.target.x !== currentPlayer.x || moveUpdates.target.y !== currentPlayer.y) {
            currentPlayer.moveArray.push(moveUpdates);
           // currentPlayer.target = moveUpdates.target;
            //currentPlayer.dt = moveUpdates.dt;
        }
        
    });



});


function resetAdvIfPurchaseDidNotGoThru(advId){
 console.log('Adv Id in resetAdvIfPurchaseDidNotGoThru');
 setTimeout(function(){ 
       			
    db.adv.find({where:{id:advId}}).then(function(adv){
		
			adv.update({sponsorshipInterest: false}).then(function(adv){
				console.log('SponsorShipInterest Set to False');
				console.log(adv);

			},function(err){
				console.log('SponsorShipInterest Set to FaLSE UPDATE ERR');
				console.log(err);

			});

    },function(err){
	console.log('Could Not Find the ad by the id');
	console.log(err);
    });

  }, 600000);
    
}

function fillUserMapBuffer(player){
    player.map = [];  
 var include = [];
 var where = {};
 where.locX = {$gte: parseInt(player.x)-2*player.screenWidth, $lte: parseInt(player.x)+2*player.screenWidth};
 where.locY = {$gte: parseInt(player.y)-2*player.screenHeight, $lte: parseInt(player.y)+2*player.screenHeight};

  include[0] = {
                    model: db.map, 
                    where: 
                            {
                            id: parseInt(player.level)
                           }
                   };

              db.tile.findAll({
                  where: where,
                  include: include
                }).then(function(tiles) {
                  player.map = tiles;

                tiles.forEach(function(t){
                    var ti = {x: t.locX, y: t.locY, w:1, h:1, gu: t.gu, gr: t.gr, gd: t.gd, gl: t.gl};
                    player.maptree.put(ti);
                });


                }, function(e) {
                  console.log('SHOOT COULDNtGET CELL BUFFER FOR PLAYER');
                });  
}



function maxinarray(a){
    var m= -9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i] > m){
            m = a[i];
        }
    }

    return m;
}

function mininarray(a){
    var m= 9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i] < m){
            m = a[i];
        }
    }

    return m;
}
function maxinarray_x(a){
    var m= -9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i].locX > m){
            m = a[i].locX;
        }
    }

    return m;
}

function mininarray_x(a){
    var m= 9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i].locX < m){
            m = a[i].locX;
        }
    }

    return m;
}

function maxinarray_y(a){
    var m= -9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i].locY > m){
            m = a[i].locY;
        }
    }

    return m;
}

function mininarray_y(a){
    var m= 9999999, i=0, n = a.length;

    for(; i<n; i++){
        if(a[i].locY < m){
            m = a[i].locY;
        }
    }

    return m;
}


function needMoreMap(player){

  return false;  
}

function  updatePlayerCellMoves(player){
	var searchCells = player.maptree.get({x:player.x, y: player.y, w: 5, h: 5});
	//console.log("UPDATE PLAYER MOVES - SearchCELLS");
	//console.log(searchCells);

      var searchCellLength = searchCells.length;

        var cell = {};
    for(var i=0; i<searchCellLength; i++){
        if(searchCells[i].x === player.cellX && searchCells[i].y === player.cellY){
            cell = searchCells[i];
            break;
        }
    }

  if(!!cell){
   player.cellMoves.l = !cell.gl;
   player.cellMoves.r = !cell.gr;
   player.cellMoves.u = !cell.gu;
   player.cellMoves.d = !cell.gd;

   return cell;
 }else{

    return false;
 }


}

function getAcceptableTarget(player, target, cell){

if(!!cell){
    
    player.cellMoves.l = !cell.gl;
    player.cellMoves.r = !cell.gr;
    player.cellMoves.u = !cell.gu;
    player.cellMoves.d = !cell.gd;



    if(!player.cellMoves.l && (player.x-player.radius) <= cell.x-0.5){
        if(target.x < 0) {
            target.x = 0;
        }
    }
    if(!player.cellMoves.u && (player.y+player.radius)>=cell.y+0.5){
        if(target.y > 0) {
            target.y = 0;
        }
    }
    if(!player.cellMoves.r && (player.x+player.radius)>=cell.x+0.5){
        if(target.x > 0) {
            target.x = 0;
        }
    }
    if(!player.cellMoves.d && (player.y-player.radius)<=cell.y-0.5){
        if(target.y < 0) {
            target.y = 0;
        }
    }



}else{
    console.log("NO CELL FOUND IN CELL BUFFER!!!");
    player.cellMoves.l = true;
    player.cellMoves.r = true;
    player.cellMoves.u = true;
    player.cellMoves.d = true;
}




return target;

}


function  adjustInMaze(player, cell){


if(!!cell){
    
    player.cellMoves.l = !cell.gl;
    player.cellMoves.r = !cell.gr;
    player.cellMoves.u = !cell.gu;
    player.cellMoves.d = !cell.gd;



    if(!player.cellMoves.l && (player.x-player.radius) <= cell.x-0.5){
        
            player.x = cell.x+player.radius-0.5;
        
    }
    if(!player.cellMoves.u && (player.y+player.radius)>=cell.y+0.5){
      
            player.y = cell.y-player.radius+0.5;
        
    }
    if(!player.cellMoves.r && (player.x+player.radius)>=cell.x+0.5){
       
            player.x = cell.x-player.radius+0.5;
      
    }
    if(!player.cellMoves.d && (player.y-player.radius)<=cell.y-0.5){
     
            player.y = cell.y+player.radius-0.5;
       
    }



}else{
    console.log("NO CELL FOUND IN CELL BUFFER!!!");
    player.cellMoves.l = true;
    player.cellMoves.r = true;
    player.cellMoves.u = true;
    player.cellMoves.d = true;
}



}


function maintainInBounds(player){

   if((player.x + player.radius) >= player.levelBounds[1]){
                player.x = player.levelBounds[1]-player.radius; 
            }
            
            if((player.x - player.radius) <= player.levelBounds[3]){
                player.x = player.levelBounds[3]+ player.radius;
            }
            if((player.y + player.radius) >= player.levelBounds[0]){
                player.y = player.levelBounds[0] - player.radius;
            }
            
            if((player.y - player.radius) <= player.levelBounds[2]){
                player.y = player.levelBounds[2] + player.radius;
            }
}

function movePlayer(player) {

    var moveQlength = player.moveArray.length;
	
    if(moveQlength > 3){
        moveQlength = Math.floor(0.8*moveQlength);
    }
    for(var i=0; i<moveQlength; i++){

       var movement = player.moveArray.shift();
       movement.preMoveX = player.x;
       movement.preMoveY = player.y;


        player.cellX =  Math.floor(player.x) + 0.5;
        player.cellY =  Math.floor(player.y) + 0.5;

       var currentCellMove = updatePlayerCellMoves(player);
       
        var target = {
            x:  player.x - player.x + movement.target.x,
            y:  player.y - player.y - movement.target.y
        };



         target = getAcceptableTarget(player, target, currentCellMove);


        var dist = Math.sqrt(Math.pow(target.y, 2) + Math.pow(target.x, 2));
        var deg = Math.atan2(target.y, target.x);

        player.speed = dist*0.01;


        if (player.speed >= 2.0){
            player.speed = 2.0;
        }


        var deltaY = player.speed * Math.sin(deg) * movement.dt;
        var deltaX = player.speed * Math.cos(deg) * movement.dt;


        if(target.x === 0){
            deltaX = 0;
        }
        if(target.y === 0 ){
            deltaY = 0;
        }


        if (!isNaN(deltaY)) {
            player.y += deltaY;
        }
        if (!isNaN(deltaX)) {
            player.x += deltaX;
        }

      adjustInMaze(player, currentCellMove);

      maintainInBounds(player);

       movement.postMoveX = player.x;
       movement.postMoveY = player.y;
       movement.verified = false;

      player.processedMoves.push(movement);
    }
}

function xBitsPlayerCollision(player){
//console.log('----------------Xbit-----------');
//console.log(player.name);
 
var searchXbits = xbittree.get({x:player.x, y: player.y, w: 5, h: 5});

     var xbitcollision = false;
      var searchXbitsLength = searchXbits.length;
       var collidedxbit = {};
	

       for(var i=0; i<searchXbitsLength; i++){
        if(searchXbits[i].x === player.cellX && searchXbits[i].y === player.cellY && parseInt(searchXbits[i].level,10) === parseInt(player.level,10)){
	     collidedxbit = searchXbits[i];
	     xbitcollision = true;
            break;
        }
       }
	
	if(xbitcollision){
              xbittree.remove(collidedxbit, 'id');

          db.user.findById(player.userId).then(function(usr) {
	       if (usr){
               var attributes = {};
		  attributes.xBits = usr.xBits + 1;
	    
     		   usr.update(attributes).then(function(usr) {
			xbit = xbit.filter(function(x){
		          return !(x.locX === collidedxbit.x && x.locY === collidedxbit.y);
	              });
                     
      			 player.xbits = player.xbits + 1;
			
               leaderboard.refreshSingleUserinUsersArray(player.name).then(function(res){
                  xbitleaderboardChanged = true;
                });
      		   }, function(e) {
        	 	console.log('ERROR in updateing user xbits');
			console.log(e);
     		   });
    		 } else {
    			  console.log('ERROR in updateing xbits on user');
    		 }
  	    }, function() {
     		console.log('ooops did not find user');
  	    });

	}
}


function xnumPlayerCollision(player){
 
    var searchXnums = xnumtree.get({x:player.x, y: player.y, w: 5, h: 5});
		
     var xnumcollision = false;
      var searchXnumsLength = searchXnums.length;
       var collidedxnum = {};

       for(var i=0; i<searchXnumsLength; i++){
        if(searchXnums[i].x === player.cellX && searchXnums[i].y === player.cellY && parseInt(searchXnums[i].level,10) === parseInt(player.level,10) ){
	     collidedxnum = searchXnums[i];
	     xnumcollision = true;
            break;
        }
       }

	
	if(xnumcollision){
		 


                 xnumtree.remove(collidedxnum, 'id');
	    db.xnum.findById(collidedxnum.id).then(function(xn) {
	      var attributes = {};
		attributes.found = true;
		attributes.userId = player.userId;
    		if (xn){
     		 xn.update(attributes).then(function(xn) {
			xnum = xnum.filter(function(x){
		               return x.id !== collidedxnum.id;
	              });
                   
      			 player.xnums.push(xn);
			
                 leaderboard.refreshSingleUserinUsersArray(player.name).then(function(res){
                 xnumleaderboardChanged = true;

               });
      		  }, function(e) {
        		console.log('ERROR in updateing xnum');
			console.log(e);
     		  });
    		} else {
    			  console.log('ERROR in updateing xnum11');
    		 }
  	    }, function() {
     		console.log('ooops did not find xnum');
  	    });

	}
}
function  playerViewBoundBufferThreasholdReset(player){
	 player.viewBoundBufferThreashold =  [player.y + player.screenCellsHeight/2, 
									player.x + player.screenCellsWidth/2, 
										player.y - player.screenCellsHeight/2, 
											player.x - player.screenCellsWidth/2];

}

function checkMapBuffer(player){

  if(player.viewBoundBufferThreashold[0] < player.y ||
	player.viewBoundBufferThreashold[1] < player.x ||
		player.viewBoundBufferThreashold[2] > player.y ||
			player.viewBoundBufferThreashold[3] > player.x ){
                          		
					 

  			 		fillplayerTileMap(player).then(function(rs){

					playerViewBoundBufferThreasholdReset(player); 
       			
					player.moreMapTiles = true;
    		
    			   },function(err){
				 console.log("ERROR FILLING USER MAP ARRAY and QUADTREE");
				 console.log(err);
   			 });
   }


}


function checkIfFoundFinish(player){
         if(player.map.finishXtile === player.cellX && player.map.finishYtile === player.cellY){
	     console.log('FOUND FINISH');
	     console.log(player.hasAllThreeFlags);
	     if(!player.foundFinish && player.hasAllThreeFlags){
	        player.foundFinish = true;
		 console.log('FOUND FINISH INNER');

		  var whereObj = {userId: player.userId, mapId: player.level};
			console.log('Where Obj For the find or create..');
			console.log(whereObj);
		  db.conquering.findOrCreate({where: whereObj, defaults: {howmanytimes: 1}}).spread(function(conq, created){
			
			if(created){
				console.log('FIND OR CREATE>>> -- Created');
			}else{
				console.log('FIND OR CREATE>>> -- FOUND');
					conq.update({howmanytimes: conq.howmanytimes+1}).then(function(resp){
						 console.log('Conquring Updated how many times!!');
						console.log(resp);
						
					},function(err){
						console.log('Conquring Update Fail');
						console.log(err);
					});
			}
			

			},function(err){
				console.log("ERROR IN CONQURING CREATE");
				console.log(err);
			});
	        }
         }
}

function tickPlayer(currentPlayer) {


//console.log('Memory HEAP USED');
//console.log(process.memoryUsage().heapUsed);


    movePlayer(currentPlayer);
    checkMapBuffer(currentPlayer);
    
    xnumPlayerCollision(currentPlayer);
    xBitsPlayerCollision(currentPlayer);

    checkIfFoundFinish(currentPlayer);
	
}


function moveloop() {
    
    for (var i = 0; i < users.length; i++) {
        tickPlayer(users[i]);
    }

}




function addXnum() {
    var radius = gameconfig.defaultXnumRadius;
 
        var position = gameconfig.xnumUniformDisposition ? util.uniformPosition(xnum, radius) : util.randomPosition(radius);

        position.x = Math.floor(position.x) + 0.5 - 10/2;
        position.y = Math.floor(position.y) + 0.5 - 10/2;

	var xnumlevel = Math.floor((Math.random() * 2) + 1);  // Random  -- 1 - 2 

	
        var xnumLock = "5alkvpoi2eenlaskd23kfnlskdfiu234981";
	
	 db.xnum.create({locX: position.x, locY: position.y, lock: xnumLock, level: xnumlevel}).then(function(x){
		
		
		xnum.push({id: x.id, locX: x.locX, locY: x.locY, level: x.level});
		
 		var ti = {id: x.id, x: x.locX, y: x.locY, w:1, h:1,  level: x.level};
		xnumtree.put(ti);
		
        },function(err){
		console.log('Xnum Create Err');
		console.log(err);

        });

	
  


}

var xbitId = 0;


function addXbit(toAdd) {
    var radius = 0.4;
    while (toAdd--) {
	
        var position = util.bigRandomPosition(radius);
		xbitId++;
        position.x = Math.floor(position.x) + 0.5 - 10;
        position.y = Math.floor(position.y) + 0.5 - 10;
        
	var xbitlevel = Math.floor((Math.random() * 29) + 1);  // Random  -- 1 - 30 


		xbit.push({id: xbitId, level: xbitlevel, locX: position.x, 
				locY: position.y, 
					colorR: Math.floor((Math.random() * 255)),
					   colorG: Math.floor((Math.random() * 255)),
						colorB: Math.floor((Math.random() * 255)), 
							colorA: Math.floor((Math.random() * 100))/100		
						});
		var ti = {x:  position.x, y: position.y, w:1, h:1, id: xbitId, level: xbitlevel};
		xbittree.put(ti);
 	
	
    }


}



function gameloop() {
   
//var now = moment();
//console.log(now.format("dddd, MMMM Do YYYY, h:mm:ss a"))
//
//date math example
//console.log(moment('2016-03-12 13:00:00').add(1, 'day').format('LLL'))

//time math example
//console.log(moment('2016-03-12 13:00:00').add(24, 'hours').format('LLL'))




}


function highLevelServices(){
///A script which queries the Admin state and asks what jobs need to be performed to get global game state in sync


  db.xnum.findAll({where:{found: false}}).then(function(xs){
	
      xnum = [];
       xnumtree.clear();
	xs.forEach(function(x){
	 xnum.push({id: x.id, locX: x.locX, locY: x.locY, level: x.level});
	 var ti = {id: x.id, x: x.locX, y: x.locY, w:1, h:1,  level: x.level};
	 xnumtree.put(ti);
	});

    if(xnum.length < 10){
	 addXnum();
	}

    if(xbit.length<3000){
	 addXbit(20);
      }


 },function(err){
	console.log('Get Xnum on Server bootup Error');
	console.log(err);
});




} 

function sendUpdates() {
	    users.forEach(function(u) {
      
       // u.x = u.x || 0;
      //  u.y = u.y || 0;
       
         var visibleXnum  = xnum
                 .filter(function(xx) { 
			    return (  
		      			xx.locX > (u.x - 2*u.screenCellsWidth) &&
                   			 xx.locX < (u.x + 2*u.screenCellsWidth) &&
                   			 xx.locY > (u.y - 2*u.screenCellsHeight) &&
                    			xx.locY < (u.y + 2*u.screenCellsHeight) &&
					parseInt(xx.level,10) === parseInt(u.level,10)
                            ); 
		  					 
			 });


	  var visibleXbit  = xbit
                 .filter(function(xx) { 
			    return (  
		      			xx.locX > (u.x - 2*u.screenCellsWidth) &&
                   			 xx.locX < (u.x + 2*u.screenCellsWidth) &&
                   			 xx.locY > (u.y - 2*u.screenCellsHeight) &&
                    			xx.locY < (u.y + 2*u.screenCellsHeight) &&
					parseInt(xx.level,10) === parseInt(u.level,10)

                            ); 
		  					 
			 });



        var visiblePlayers  = users.filter(function(g) {
				
				return (g.x > (u.x - u.screenCellsWidth/2 -5) &&
                              g.x < (u.x + u.screenCellsWidth/2 + 5) &&
                               g.y > (u.y - u.screenCellsHeight/2 - 5) &&
                               g.y < (u.y + u.screenCellsHeight/2 + 5) &&
					parseInt(g.level,10) === parseInt(u.level,10) );
		   });


		 visiblePlayers  = visiblePlayers.map(function(f) { 
			if(f.id !== u.id) {
                            return {
                                id: f.id,
                                x: f.x,
                                y: f.y,
                                radius: f.radius,
                                playerConfig: {
   					 border: f.playerConfig.border,
    	       			 textColor: f.playerConfig.textColor,
    					 textBorder: f.playerConfig.textBorder,
              			 textBorderSize: f.playerConfig.textBorderSize,
    		 			 defaultSize: f.playerConfig.defaultSize,
					 bodyColorR: f.playerConfig.bodyColorR,
					 bodyColorG: f.playerConfig.bodyColorG,
              			 bodyColorB: f.playerConfig.bodyColorB,
              			 bodyColorA: f.playerConfig.bodyColorA,
 					 borderColorR: f.playerConfig.borderColorR,
		 			 borderColorG: f.playerConfig.borderColorG,
              			 borderColorB: f.playerConfig.borderColorB,
               			 borderColorA: f.playerConfig.borderColorA
				      },
                                name: f.name,
				    xnumsLength: f.xnums.length,
				    xbits: f.xbits
                            };
                        } else {
			      var playerReturnObj = {
                                x: f.x,
                                y: f.y,
                                radius: f.radius,
                                playerConfig: {
   					 border: f.playerConfig.border,
    	       			 textColor: f.playerConfig.textColor,
    					 textBorder: f.playerConfig.textBorder,
              			 textBorderSize: f.playerConfig.textBorderSize,
    		 			 defaultSize: f.playerConfig.defaultSize,
					 bodyColorR: f.playerConfig.bodyColorR,
					 bodyColorG: f.playerConfig.bodyColorG,
              			 bodyColorB: f.playerConfig.bodyColorB,
              			 bodyColorA: f.playerConfig.bodyColorA,
 					 borderColorR: f.playerConfig.borderColorR,
		 			 borderColorG: f.playerConfig.borderColorG,
              			 borderColorB: f.playerConfig.borderColorB,
               			 borderColorA: f.playerConfig.borderColorA
				      },
				    moreMapTiles: false,
				    newTiles: f.map.tiles,
				    xnumsLength: f.xnums.length,
				    xnumsVal: f.xNumsVal(),
				    xbits: f.xbits,
				    target: f.target,
                                processedMoves: f.processedMoves,
                                levelBounds: f.levelBounds,
				    foundFinish: false
                             };
				if(f.foundFinish){
					
					playerReturnObj.foundFinish = true;
					return playerReturnObj;
				}
                            if(f.moreMapTiles){
                              playerReturnObj.moreMapTiles = true;
				  f.moreMapTiles = false;
                              return playerReturnObj;
				}else{
				   playerReturnObj.moreMapTiles = false;
				   return playerReturnObj;
			       }
                        }
              
               });
		
			
 

        sockets[u.id].emit('serverTellPlayerMove', visiblePlayers, visibleXnum, visibleXbit);
        u.processedMoves = [];

        if (xbitleaderboardChanged) {
           sockets[u.id].emit('leaderboardXbits', leaderboard.getXbitOrderedArray());
	     
        }
         if (xnumleaderboardChanged) {
           sockets[u.id].emit('leaderboardXnums', leaderboard.getXnumOrderedArray());
	     
        }
    });
  xbitleaderboardChanged = false;
  xnumleaderboardChanged = false;
}



setInterval(moveloop, 1000 / 60);

setInterval(gameloop, 1000);

setInterval(highLevelServices, 60000);  ///Run Once Per Minuet



setInterval(sendUpdates, 1000 / 5);




