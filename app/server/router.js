
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var NM = require('./modules/netatmo-manager');
var IM = require('./modules/iris-manager');

var url = require('url');


var crypto = require('crypto');





module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){

	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Home# Account'});
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Home# Account'});
				}
			});
		}
	});

	app.post('/', function(req, res){
		AM.manualLogin(req.param('email'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});

// logged-in user homepage //

	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('home', {
				title : 'home',
				countries : CT,
				udata : req.session.user,
			});
	    }
	});



	app.get('/settings', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('settings', {
				title : 'home',
				countries : CT,
				udata : req.session.user,
			});
	    }
	});

	app.post('/settings', function(req, res){
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});

// creating new accounts //

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT});
	});

	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country'),
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});

// view & delete accounts //

	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});

	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');
		});
	});

// HENKES TEST //

	app.get('/api/getAllTemperatures', function(req, res) {
		NM.getAllTemperatures(function(err, temperatures) {
			res.json(temperatures);
		});
	});

// For connecting and handling of Netatmo apps //

	app.get('/brand/netatmo', function(req, res) {

		//Check url parameters
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		var oldState = req.session.csrf_token;

		//Function for generating csrf token
		function randomValueHex (len) {
		    return crypto.randomBytes(Math.ceil(len/2))
		        .toString('hex') // convert to hexadecimal format
		        .slice(0,len);   // return required number of characters
		}

		//Generating csrf token
		var csrf_token = randomValueHex(60);

		//Saving token to session
		req.session.csrf_token = csrf_token;

		var access_token = "";

		// Check if user owns an netatmo-acesstoken allready and is not outdated
		AM.CheckUserNetatmoToken(req.session.user.email, function(o, access_token) {
			if (o != false)
			{
				// If a token exists and is fully valid
				if (o == true)
				{
							res.render('netatmo', {  title: 'Connect to Netatmo', state_token: csrf_token, NetatmoConnected: true });
				}

				// If the token is outdated, a refresh will be done
				else if (o == "old")
				{
					NM.RequestRefreshAuthToken(req.session.user.NetatmoRefreshToken, function(response_chunk) {
						console.log(response_chunk);
						response_chunk = JSON.parse(response_chunk);

						access_token = response_chunk.access_token;

						AM.saveCredentials(response_chunk, req.session.user.email, function() {

						});
					});

					res.render('netatmo', {  title: 'Connect to Netatmo', state_token: csrf_token, NetatmoConnected: true });
				}

				//Make iris devicelist request
				IM.RequestDeviceList(access_token, function(chunk) {
					//TODO: Create fallback checking if Iris is down or chunk is not returned in correctly
					AM.SaveDeviceListDB(req.session.user.email, chunk);
					
					chunk = IM.syntaxHighlight(JSON.parse(chunk));
					console.log(chunk);
					
				});
			}
			else
			{
				//Does url come with query
				if(Object.keys(query).length != 0) {
					if (query.state !== oldState) {
						//Denied
						console.log("State token doesnt match");
					} else if(query.error === 'invalid_client') {
						//Invalid client
						console.log("Invalid Client");
					} else if(query.error === 'access_denied') {
						//Access denied
						console.log("Access denied");
					} else {
							//Valid request
							//Make access-token request
							NM.RequestAuthToken(query.code, function(response_chunk) {
								console.log(response_chunk);
								response_chunk = JSON.parse(response_chunk);

								access_token = response_chunk.access_token;

								AM.saveCredentials(response_chunk, req.session.user.email, function() {

								res.render('netatmo', {  title: 'Connect to Netatmo', state_token: csrf_token, NetatmoConnected: true });
								});
							});
						}
					}
				res.render('netatmo', {  title: 'Connect to Netatmo', state_token: csrf_token, NetatmoConnected: false });
			}
		});
	});

	app.post('/brand/netatmo', function(req, res){
			AM.removeNetatmoAccessToken(req.session.user.email, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user.NetatmoAccessToken = "";
					req.session.user.NetatmoRefreshToken = "";
					req.session.user.NetatmoAccessTokenTime = "";
					res.send('ok', 200);
				}
			});
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
};
