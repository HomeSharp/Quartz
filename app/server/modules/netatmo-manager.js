// We need this to build our post string
var querystring = require('querystring');
var http = require('http');


exports.RequestAuthToken = function(code, callback)
{
  // Build the post string from an object
  var post_data = querystring.stringify({
  		'grant_type': 'authorization_code',
	    'client_id': '54c64eaa485a8812863eadfd',
	    'client_secret': 'RnBuzxADbpdH1TxxnSzASBsW6mQdv',
	    'code': code,
	    'redirect_uri': 'http://127.0.0.1:8080/brand/netatmo',
	    'scope': 'read_station read_thermostat write_thermostat'
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'api.netatmo.net',
      port: '80',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Content-Length': post_data.length
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
          callback(chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}
