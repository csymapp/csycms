#!/usr/bin/env node

'use strict';



const yargs = require("yargs")
, argv = yargs.argv
, site = argv.SITE || process.env.SITE

// Modules
let debug = require('debug')('CSYCMS');

// Here is where we load csycms.
// When you are in your own project repository,
// csycms should be installed via NPM and loaded as:
// let csycms = require('csycms');
//
// For development purposes, we load it this way in this example:
let csycms = require('../app/index.js');

// Then, we load our configuration file
// This can be done inline, with a JSON file,
// or with a Node.js module as we do below.
let config = require(`../config/${site}/system.config.js`)(__dirname);
  
// Finally, we initialize csycms
// with our configuration object
let app = csycms(config);

// Load the HTTP Server
let server = app.listen(app.get('port'), function () {
  console.log('Express HTTP server listening on port ' + server.address().port);
});
