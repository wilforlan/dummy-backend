var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db_uri = "mongodb://localhost/dummy_app_backend";
var single_user_id = '';
var records = 
	{
		'users' : [
			{
				name: 'John Doe',
			    email: 'joe@doe.com',
			    password: bcrypt.hashSync('password123')
			}
		],
		'bikers' : [
			{
				name: 'Williams Isaac',
			    email: 'williams@isaac.com',
			    city: 'Texas',
			    ride_in_group: 'Always',
			    days_of_week: ['Sun','Mon','Wed'],
			},
			{
				name: 'Jane Mack',
			    email: 'jane@mail.com',
			    city: 'New York',
			    ride_in_group: 'Never',
			    days_of_week: ['Sun','Mon','Wed','Fri']
			},
			{
				name: 'Mackrovik Robertov',
			    email: 'mack@gmail.com',
			    city: 'Pal Alto',
			    ride_in_group: 'Sometimes',
			    days_of_week: ['Sun','Mon','Tue','Wed','Thur','Fri','Sat']
			},
			{
				name: 'Sergiy Barna',
			    email: 'barner@outlook.com',
			    city: 'Arkansas',
			    ride_in_group: 'Never',
			    days_of_week: ['Sun','Wed']
			},
			{
				name: 'Owen Bruce',
			    email: 'owen@boa.com',
			    city: 'Regina',
			    ride_in_group: 'Always',
			    days_of_week: ['Sun']
			}
		]
	}
var collections = ['users', 'bikers'];
var _dropCollection = (callback) => { 
	MongoClient.connect(db_uri, (err, db) => {
		assert.equal(null, err);
		console.log("Connected correctly to server.");
		var itemsProcessed = 0;
		collections.forEach((name, index, array) =>{
			db.listCollections({name: name})
		    	.next(function(err, collinfo) {
			        if (collinfo) {
			        	console.log(`Collection ${name} exist, recreating it`)
			        	db.dropCollection(name, (err, result) => {  
					        if (err) { callback(err); }  
					        db.createCollection(name, (err, res) => {
							    if (err) throw err;
				        		console.log(`Collection ${name} Created`);
				        		itemsProcessed++;
								if(itemsProcessed === array.length) {
							      db.close();
							      callback(null, res)
							    }
							});  
					    });  
			        }else{
			        	console.log(`Collection ${name} do not exist, Creating  it`)
			        	db.createCollection(name, (err, res) => {
						    if (err) throw err;
			        		console.log(`Collection ${name} Created`);
			        		itemsProcessed++;
							if(itemsProcessed === array.length) {
						      db.close();
						      callback(null, res)
						    }
						});
			        }
		    	});
		}, this)

	  	// process.exit();
	});
      
}

var _createUserMigrations = (callback) => {
		try {
			MongoClient.connect(db_uri, (err, db) => {
			   var inserted = db.collection('users').insertMany(records.users);
			   inserted.then((resp) => {
			   	single_user_id = resp.insertedIds[0];
			   	console.log('Users Created', resp);
			   	callback(null, resp)
			   });
			});
		} catch (e) {
		   console.log ('Users Error', e);
		   callback(e, null)
		}
}

var mapBikers = (array, callback) => {
	var bikers_record = array.map( x => {
	  x.created_by = single_user_id;
	  x.created_at = new Date().toISOString()
	  return x
	})
	callback(bikers_record)
}
var _createBikersMigrations = (callback) => {
		try {
			mapBikers(records.bikers, (rec) => {
				MongoClient.connect(db_uri, (err, db) => {
				   var inserted = db.collection('bikers').insertMany(rec);
				   inserted.then((resp) => {
				   		console.log('Bikers Created', resp);
				   		callback(null, resp)
				   });
				});
			})
		} catch (e) {
		   console.log ('Bikers Error', e);
		   callback(e, null)
		}
}


MongoClient.connect(db_uri, (err, db) => {
    if (err) { throw err; }  

    async.series([_dropCollection, _createUserMigrations, _createBikersMigrations], (err, result)  => { 
        if (err) { throw err; }  
        console.info('Completed successfully! Result: ' + result);  
        process.exit();  
    });  
});