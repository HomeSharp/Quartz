// We need this to build our post string
var querystring = require('querystring');
var http = require('http');


exports.RequestDeviceList = function(access_token, callback)
{ 
  // An object of options to indicate where to post to
  var post_options = {
      host: '127.0.0.1',
      port: '3000',
      path: '/api/User/Devices',
      method: 'GET',
      headers: {
          'access_token': access_token,
          'brand': 'Netatmo'
      }
  };

  // Set up the request
  var get_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          callback(chunk);
          saveToDB(chunk);
      });
  });

  // post the data
  get_req.end();

}