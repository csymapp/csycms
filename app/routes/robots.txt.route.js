
'use strict';

// Modules
var path                = require('path');
var fs                  = require('fs');
var sm                  = require('sitemap');
var _                   = require('underscore');
const contentProcessors = require('../functions/contentProcessors');
const utils             = require('../core/utils');

function route_robots_txt (config) {
  return function (req, res, next) {
      var hostname = config.hostname || req.headers.host;
      if(!hostname.includes('http://'))hostname=`http://${hostname}`

    // res.header('Content-Type', 'application/xml');
    res.end(`User-agent: * \r\nDisallow: \nAllow: / \r\nSitemap: ${hostname}/sitemap.xml \r\n`);

  };
}

function listFiles (dir) {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? listFiles(name) : [name]);
  }, []);
}

// Exports
module.exports = route_robots_txt;
