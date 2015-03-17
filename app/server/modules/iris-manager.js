// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var config = require('./config.js');

/* For handling Netatmo */

exports.RequestNetatmoDeviceList = function(access_token, callback)
{
  //console.log(access_token + "hej");
  // An object of options to indicate where to post to
  var post_options = {
      host: config.irisConfigValues().domain,
      port: config.irisConfigValues().port,
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
          if(res.statusCode == 200) {
            callback(chunk);
          } else {
            console.log("Iris didn't return device list");
          }
      });
  });

  // post the data
  get_req.end();

}

/* For handling Telldus */

exports.RequestTelldusDeviceList = function(keys, callback)
{

  //console.log(access_token + "hej");
  // An object of options to indicate where to post to
  var post_options = {
      host: config.irisConfigValues().domain,
      port: config.irisConfigValues().port,
      path: '/api/User/Devices',
      method: 'GET',
      headers: {
          'publickey': keys.publicKey,
          'privatekey': keys.privateKey,
          'access_token': keys.token,
          'tokensecret': keys.tokenSecret,
          'brand': 'Telldus'
      }
  };

  // Set up the request
  var get_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
          if(res.statusCode == 200) {
            callback(chunk);
          } else {
            console.log("Iris didn't return device list");
          }
      });
  });

  // post the data
  get_req.end();

}


exports.TurnOnTelldusDevice = function(keys, deviceId, callback)
{
  // An object of options to indicate where to post to
  var post_options = {
      host: config.irisConfigValues().domain,
      port: config.irisConfigValues().port,
      path: '/api/Command/turnOn?deviceId=' + deviceId,
      method: 'POST',
      headers: {
          'publickey': keys.publicKey,
          'privatekey': keys.privateKey,
          'access_token': keys.token,
          'tokensecret': keys.tokenSecret,
          'brand': 'Telldus'
      }
  };

  // Set up the request
  var get_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');

      res.on('data', function (response) {
          if(res.statusCode == 200) {
            // console.log(response);
            callback(response);
          } else {
            console.log("Some failiure occured.");
          }
      });
  });

  // post the data
  get_req.end();

}

exports.TurnOffTelldusDevice = function(keys, deviceId, callback)
{
  // An object of options to indicate where to post to
  var post_options = {
      host: config.irisConfigValues().domain,
      port: config.irisConfigValues().port,
      path: '/api/Command/turnOff?deviceId=' + deviceId,
      method: 'POST',
      headers: {
          'publickey': keys.publicKey,
          'privatekey': keys.privateKey,
          'access_token': keys.token,
          'tokensecret': keys.tokenSecret,
          'brand': 'Telldus'
      }
  };

  // Set up the request
  var get_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');

      res.on('data', function (response) {
          if(res.statusCode == 200) {
            // console.log(response);
            callback(response);
          } else {
            console.log("Some failiure occured.");
          }
      });
  });

  // post the data
  get_req.end();

}

/* Other functions */

exports.syntaxHighlight = function(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        //return '<span class="' + cls + '">' + match + '</span>';
        return match;
    });
}
