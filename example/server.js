#!/usr/bin/env node

'use strict';

// Modules
var debug = require('debug')('CSYCMS');

// Here is where we load CSYCMS.
// When you are in your own project repository,
// CSYCMS should be installed via NPM and loaded as:
// var CSYCMS = require('CSYCMS');
//
// For development purposes, we load it this way in this example:
var CSYCMS = require('../app/index.js');

// Then, we load our configuration file
// This can be done inline, with a JSON file,
// or with a Node.js module as we do below.
var config = require('./config.default.js');

// Finally, we initialize CSYCMS
// with our configuration object
var app = CSYCMS(config);

// Load the HTTP Server
var server = app.listen(app.get('port'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});
