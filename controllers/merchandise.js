var db = require('../db.js');
var middleware = require('../middleware.js')(db);
var _ = require('underscore');
var request = require('request');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false});


var fs = require('fs');


module.exports.controller = function(app) {

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

var rmDir = function(dirPath) {
   try { var files = fs.readdirSync(dirPath); }
   catch(e) { return; }
     if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
   fs.rmdirSync(dirPath);
};


var makeStoreDesc = function(products){

var promises = products.map(function(prod){
		//console.log("PROD IN MAP FUNCTION");
		//console.log(prod);
	var where = {};
       var include = [];
            include[0] = {
                    model: db.merch, 
                    where: 
                           {
                            id: prod.id
                           }
                     
                   };

        return  db.proddesc.findAll({
                  where: where,
                  include: include
                       }).then(function(desc){
				//console.log('Promises map from product list..');
				//console.log(desc);
                            prod.dataValues['proddesc'] = desc;
                   }).catch(function(err){
			console.log("ERR adding desc");
			console.log(err);
                 });


        });

//console.log("SETUP ALL PROMISES>>");
//console.log(products);

 return Promise.all(promises).then(function(){
			//console.log('products after all');
	//console.log(products);
        return Promise.resolve(products);
        });

};

var makeStoreImgs = function(products){

var promises = products.map(function(prod){
		//console.log("PROD IN MAP FUNCTION");
		//console.log(prod);
	var where = {};
       var include = [];
            include[0] = {
                    model: db.merch, 
                    where: 
                           {
                            id: prod.id
                           }
                     
                   };

        return  db.prodimg.findAll({
                  where: where,
                  include: include
                       }).then(function(imgarr){
				//console.log('Promises map from product list..');
				//console.log(img);
                            prod.dataValues['prodimgs'] = imgarr;
				
                            for (var i=0; i<imgarr.length; i++){
 					
					
                              var ext = path.extname(imgarr[i].img);
				 
	                       var fileName = path.basename(imgarr[i].img, ext);
				  prod.dataValues['prodimgs'][i]['dataValues']['imgL'] = fileName+'_L'+ext;
				  prod.dataValues['prodimgs'][i]['dataValues']['imgM'] = fileName+'_M'+ext;
                              prod.dataValues['prodimgs'][i]['dataValues']['imgS'] = fileName+'_S'+ext;
                            
                             }
				
                   }).catch(function(err){
			console.log("ERR adding images");
			console.log(err);
                 });

        });

//console.log("SETUP ALL PROMISES>>");
//console.log(products);

 return Promise.all(promises).then(function(){
			//console.log('products after all');
	  // console.log(products);
        return Promise.resolve(products);
        });

};


var makeStoreOptionCats = function(products){

var promises = products.map(function(prod){
		//console.log("PROD IN MAP FUNCTION");
		//console.log(prod);
	var where = {};
       var include = [];
            include[0] = {
                    model: db.merch, 
                    where: 
                           {
                            id: prod.id
                           }
                   };

        return  db.prodoptioncat.findAll({
                  where: where,
                  include: include
                       }).then(function(optioncatarr){
				console.log('OPTION ARRAY..');
				
                           

                            prod.dataValues['prodoptioncats'] = optioncatarr;
				
 				console.log(prod.dataValues['prodoptioncats']);
					
                   }).catch(function(err){
			console.log("ERR adding images");
			console.log(err);
                 });

        });

//console.log("SETUP ALL PROMISES>>");
//console.log(products);
 console.log("PROMISES ON OPTION CATS>>");
console.log(promises);

 return Promise.all(promises).then(function(){
			//console.log('products after all');
	  // console.log(products);
        return Promise.resolve(products);
        });

};


var makeStoreOptions = function(products){

var promises = [];

  
	products.forEach(function(prod){
		prod.dataValues['prodoptioncats'].forEach(function(cats){
				
                            var where = {};
       			var include = [];
          			  include[0] = {
                   			 model: db.prodoptioncat, 
                   			 where: 
                          		 {
                           		  id: cats.id
                           		 }
                   			};

                      promises.push(                             
                            db.prodoption.findAll({
                                where: where,
                               include: include
                            }).then(function(opt){
					console.log('OPTION>>');
					console.log(opt);
					console.log('CATS');
					console.log(cats);
					cats.dataValues['options'] = opt;
				})
			);
                          

		});  //end inner


         });//end outer


 console.log("PROMISES ON OPTIONS>>");
console.log(promises);

//console.log("SETUP ALL PROMISES>>");
//console.log(products);

 return Promise.all(promises).then(function(){
			//console.log('products after all');
	  // console.log(products);
        return Promise.resolve(products);
        });

};




app.get('/api/v1/merch', middleware.requireAuthentication, function(req,res){
 
   var query  = req.query;
    

  var user = req.user;

      var where = {};
      
      var include = [];
	//include[0] = {model: db.proddesc};

 
    var limit = 10;
    var offset = 0;
    var order  = [['id', 'ASC']];

   if(query.hasOwnProperty('page')){
     offset = query.page*10;
    }

   if(query.hasOwnProperty('orderBy')){
       order  = [['price', 'DESC']];
    }

  db.merch.findAll({
    where: where,
    include: include,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(products) {
	
  
        makeStoreDesc(products).then(function(storewithdesc){
				makeStoreImgs(storewithdesc).then(function(storewithimgs){
					  makeStoreOptionCats(storewithimgs).then(function(storewithoptioncats){
							makeStoreOptions(storewithoptioncats).then(function(storewithoptions){
                                                   res.json(storewithoptions);
						});
					});
                          });

                 });
       

  }, function(e) {
    res.status(500).json(e);
  });

  
});


app.get('/api/v1/merch/:id', middleware.requireAuthentication, function(req,res){
 
var prodId = parseInt(req.params.id, 10);

    var where = {id: prodId};
 
db.merch.findAll({
    where: where
  }).then(function(products) {
	
  
        makeStoreDesc(products).then(function(storewithdesc){
				makeStoreImgs(storewithdesc).then(function(storewithimgs){
					  makeStoreOptionCats(storewithimgs).then(function(storewithoptioncats){
							makeStoreOptions(storewithoptioncats).then(function(storewithoptions){
                                                   res.json(storewithoptions);
						});
					});
                          });

                 });
       

  }, function(e) {
    res.status(500).json(e);
  });

  


  
});



app.post('/api/v1/merch', [bodyParser.json(), middleware.adminOnly], function(req, res){

var body = _.pick(req.body,
			 'sku',
			 'name', 
			  'baseprice', 
                        'wholesaleprice'
                       );
body.price = body.baseprice;

       db.merch.create(body).then(function(item){   
		console.log('ITEM CREATED>>>??');
		 mkdirSync('./cdn/public/prodImages/'+item.id);

             res.status(200).json(item.toJSON());
        },function(err){
            res.status(400).json(err);
        });


});


app.put('/api/v1/merch/:id', [bodyParser.json(), middleware.adminOnly], function(req, res){

var storeItemId = parseInt(req.params.id, 10);

var body = _.pick(req.body,
			 'name', 
			  'baseprice', 
                        'wholesaleprice', 
                        'prodinfo',
			     'inventory');

 var attributes = {};
 
  if (body.hasOwnProperty('name')) {
    attributes.name = body.name;
  }
  if (body.hasOwnProperty('baseprice')) {
    attributes.price = body.baseprice;
  }
  if (body.hasOwnProperty('wholesaleprice')) {
    attributes.wholesaleprice = body.wholesaleprice;
  }
  if (body.hasOwnProperty('prodinfo')) {
    attributes.prodinfo = body.prodinfo;
  }
  if (body.hasOwnProperty('inventory')) {
    attributes.inventory = body.inventory;
  }

      db.merch.findById(storeItemId).then(function(item) {
    if (item){
      item.update(attributes).then(function(item) {
        res.json(item.toJSON());
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


app.delete('/api/v1/merch/:id', middleware.adminOnly, function(req, res){

var storeItemId = parseInt(req.params.id, 10);

  db.merch.destroy({where: {id: storeItemId}}).then(function(deleted){
         if(deleted){
          rmDir('./cdn/public/prodImages/'+storeItemId);
          res.status(204).send();
         } else{
          res.status(404).json({error: 'Item not Deleted...'});
         }
      },function(err){
         res.status(500).json(err);
   }); 



});



};

