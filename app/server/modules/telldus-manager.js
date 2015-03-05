var querystring = require('querystring');
var http = require('http');
var config = require('./config.js');

var OAuth = require('oauth').OAuth;

exports.RequestAuthToken = function()
{

  var oa = new OAuth("http://api.telldus.com/oauth/requestToken",
                    "http://api.telldus.com/oauth/accessToken",
                    config.telldusConfigValues().public_key,
                    config.telldusConfigValues().private_key,
                    "1.0",
                    "http://127.0.0.1:8080",
                    "HMAC-SHA1");

  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    console.log(error);
    console.log(oauth_token);
    console.log(oauth_token_secret);
    console.log(results);
  })

}
