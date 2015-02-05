
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

//var dbPort 		= 27017;
//var dbHost 		= 'localhost';
//var dbName 		= 'node-login';
var dbPort 		= 45097;
var dbHost 		= 'ds045097.mongolab.com';
var dbName 		= 'cobmedia';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
        db.authenticate('CobMedia', 'CobMedia2014', function(err, res) {
            console.log('authenticated, db admin logged in. :: ' + dbName);
        });
	}
});
var temperatureValues = db.collection('netatmoData');


exports.getAllTemperatures = function(callback)
{
	temperatureValues.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


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
