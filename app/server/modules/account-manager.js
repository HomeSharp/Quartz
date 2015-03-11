var config = require('./config.js');

var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/* establish the database connection */

var db = new MongoDB(config.databaseConfigValues().dbName, new Server(config.databaseConfigValues().dbHost, config.databaseConfigValues().dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('Connected to database :: ' + config.databaseConfigValues().dbName);
        db.authenticate(config.databaseConfigValues().dbUsername, config.databaseConfigValues().dbPassword, function(err, res) {
            console.log('Authenticated, db admin logged in. :: ' + config.databaseConfigValues().dbName);
        });
	}
});

var accounts = db.collection('accounts');

/* Login validation methods */

exports.autoLogin = function(email, pass, callback)
{
	accounts.findOne({email:email}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(email, pass, callback)
{
	accounts.findOne({email:email}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({email:newData.email}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({email:newData.email}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}


exports.saveCredentials = function(response_chunk, email, callback)
{
	try {
		//Save netatmo credentials to mongoDb
		accounts.findOne({email:email}, function(e, o){
			o.NetatmoAccessToken = response_chunk.access_token;
			o.NetatmoRefreshToken = response_chunk.refresh_token;
			o.NetatmoAccessTokenTime = new Date().getTime() / 1000 + response_chunk.expires_in;

			accounts.save(o, {safe: true}, function(err) {
				console.log("Access token saved to database.");
				callback();
			});
		});
	} catch (e) {
		console.log(e);
	}
}

/* Actions for Netatmo */

exports.CheckUserNetatmoToken = function(email, callback)
{
	try {
		//Check at mongoDb if user has got any netatno credentials
		accounts.findOne({email:email}, function(e, o) {
			if (o.NetatmoAccessToken != null && o.NetatmoAccessToken != ""){
				if(o.NetatmoAccessTokenTime <= new Date().getTime() / 1000)
				{
					console.log('Token is old, needs refresh');
					callback("old");
				}
				else
				{
					console.log('Token exists and is valid');
					callback(true, o.NetatmoAccessToken);
				}
			}
			else
			{
				console.log('No token exists');
				callback(false, null);
			}
		});
	} catch (e) {
		console.log(e);
	}
}

exports.removeNetatmoAccessToken = function(email, callback)
{
	try {
		accounts.findOne({email:email}, function(e, o){
			if (e){
				callback(e, null);
				console.log(email);
			}	else{
							o.NetatmoAccessToken = "";
							o.NetatmoRefreshToken = "";
							o.NetatmoAccessTokenTime = "";
							o.NetatmoDeviceList = "";
							accounts.save(o, {safe: true}, callback);
			}
		});
	} catch (e) {
		console.log(e);
	}
}

exports.SaveDeviceListDB = function(brand, email, chunk) {
	//Save deviceList to databse
	//Save netatmo credentials to mongoDb
	try
	{
		chunk = JSON.parse(chunk);
		accounts.findOne({email:email}, function(e, o){
			
			if(brand === 'Netatmo') {
				o.NetatmoDeviceList = chunk;
			} else if(brand === 'Telldus') {
				o.TelldusDeviceList = chunk;
			}

			accounts.save(o, {safe: true}, function(err) {
				console.log("Device list saved to database.");
			});
		});
	}
	catch (error)
	{
		console.log(error);
	}
}

/* Actions for Telldus */

exports.CheckUserTelldusKeys = function(email, callback)
{
	try
	{
		//Check at mongoDb if user has got any telldus credentials
		accounts.findOne({email:email}, function(e, o) {
			if (o.TelldusKeys != null && o.TelldusKeys != "")
			{
				console.log('Keys for Telldus are stored in the database.');
				callback(true, o.TelldusKeys);
			}
			else
			{
				console.log('No keys for Telldus are stored in the database.');
				callback(false, null);
			}
		});
	}
		catch (e) {
		console.log(e);
	}
}

exports.saveTelldusKeys = function(email, keys, callback) {
	// Save Telldus Live keys to database
	try
	{
		accounts.findOne({email:email}, function(e, o){
			o.TelldusKeys = keys;
			accounts.save(o, {safe: true}, function(err) {
				console.log("Telldus Live keys saved to databse.");
			});
			callback();
		});
	}
	catch (error)
	{
		console.log(error);
	}
}

exports.removeTelldusKeys = function(email, callback)
{
	// Remove Telldus Live keys from database
	try
	{
		accounts.findOne({email:email}, function(e, o){
			if (e)
			{
				callback(e, null);
				console.log(email);
			}
			else
			{
				o.TelldusKeys = "";
				accounts.save(o, {safe: true}, callback);
			}
		});
	}
	catch (e)
	{
		console.log(e);
	}
}

exports.addDeviceToUser = function(email, device, callback) {

	
	// Save Telldus Live keys to database
	try
	{
		accounts.findOne({email:email}, function(e, o){
			
			//Insert device into collection of telldus-devices

			// o.TelldusDevices = keys;
			/*
			accounts.save(o, {safe: true}, function(err) {
				console.log("Telldus Device saved to databse.");
			});

*/
			callback();

		});
	}
	catch (error)
	{
		console.log(error);
	}

}



/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
