#!/usr/bin/env node

'use strict';

// Modules
var debug = require('debug')('CSYCMS');

// Here is where we load csycms.
// When you are in your own project repository,
// csycms should be installed via NPM and loaded as:
// var csycms = require('csycms');
//
// For development purposes, we load it this way in this example:
var csycms = require('../app/index.js');

// Then, we load our configuration file
// This can be done inline, with a JSON file,
// or with a Node.js module as we do below.
var config = require('../config/system.config.js')(__dirname);

// Finally, we initialize csycms
// with our configuration object
var app = csycms(config);

// Load the HTTP Server
console.log('listening     ')
var server = app.listen(app.get('port'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});
