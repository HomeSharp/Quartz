// In this file, all the user specific settings are changed to the users liking.

// Overall settings for the whole application. Remember to change the domain to match the one you are using
exports.appConfigValues = function()
{
  var AppSettings = {
    domain: "ENTER YOUR DOMAIN HERE"
  };

  return AppSettings;
}

// Database settings, change them all to reflect the ones you are using
exports.databaseConfigValues = function()
{
  var DatabaseSettings = {
    dbPort: 000000,
    dbHost: "ENTER YOUR DOMAIN HERE",
    dbName: "DATABASE NAME",
    dbUsername: "DATABASE USERNAME",
    dbPassword: "DATABASE PASSWROD"
  };

  return DatabaseSettings;
}

// Specific settings for Iris, change the domain and port Iris is active on
exports.irisConfigValues = function()
{
  var IrisSettings = {
    port: 3000,
    domain: "ENTER YOUR DOMAIN HERE"
  };

  return IrisSettings;
}

// Change these settings to match your applications. Insert your own clientId and clientSecret recieved from Netatmo
exports.netatmoConfigValues = function()
{
  var NetatmoSettings = {
    clientId: "ENTER YOUR CLIENT ID HERE",
    clientSecret: "ENTER YOUR SUPER SECRET SECRET HERE"
  };

  return NetatmoSettings;
}
