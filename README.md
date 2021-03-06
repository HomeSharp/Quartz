# Quartz
Core Services (Code Name: Quartz)

## What is Quartz?
Quarts is a GUI extension module, built upon and reliant on the API-module Iris.
Quarts handles user management, device management, linking of accounts and handles
requests and responses through Iris.

## Installation
1. Install Node JS on your machine
2. Install MongoDB on your machine
3. Install and run Iris: https://github.com/HomeSharp/Iris
4. Update the connection settings in /app/server/modules/account-manager.js to match your MongoDB-settings
5. Open a command line tool, navigate to the Quartz dir on your local file system
6. Run the command "npm install" in the command line tool, dependencies are installed
7. Run the command "node app" and the node server starts
8. Visit "127.0.0.1:8080" in your browser of choice and Quartz should now be running

## Account setup
1. Click the "Create an account" link on the landing page
2. Enter your credentials and hit the "submit" button
3. Use your new account to log in
4. Under "update your setting" you can change your account settings if desired

## Device sync
1. Log in using your Quartz-account
2. Under the header "Devices" click the desired account you like to sync with Quartz
3. Click the "sync one now" link
4. If syncing for example Netatmo, you are redirected to Netatmo. Login with your user credentials for Netatmo and verify access
5. After verification you are redirected back to Quartz and a verification message of the sync beeing successful is shown
6. Devices shows up as soon as they have been fully synced with Quartz, refresh page if needed

## Device unsync
1. Log in using your Quartz-account
2. Under the header "Devices" click the desired account you like to unsync with Quartz
3. Click the "Unlink account" button
4. Your devices are unsynced from Netatmo and you are redirected back to the landing page

# For developers

## App structure

### app/
All the root contents, here you'll find the package.json containing the project dependencies, and also the app.js from where the app
is initialized and run. In app.js the port from which the app is run can be changed.

### app/public
This directory contains all the publicly rendered and handled content, css, images, jQuery and such.

### app/public/js
This directory contains the public controllers and views, event-handlers, form validators, AJAX-req/res-handlers. Simply all the JS needed to be run and handled client-side.

### app/server
This directory contains the server-side code, where everything from handling database-queries to emails are handled. To be noted is that the enginge Jade is used in this project, thus all views renderer for the server side can be found here. Another important file to note is the "router.js", handling all the routes.

### app/server/modules
Modules for the server-side, all named after their specific task/tasks. "account-manager.js" for example, handles all the server-side code for creating, updating, deleting and modifying a user account. To be noted is that some functions for handling tokens for external services are handled here as well. This is also where you primarily change the database-settings.

### app/server/views
The views for client side, written in Jade.

## Suggestions for continued developement
* Auto-keys for Telldus Live
* /home should act as a dashboard for all the connected devices
