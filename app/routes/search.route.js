
'use strict';

// Modules
var validator                      = require('validator');
var _s                             = require('underscore.string');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const searchHandler = require('../core/search');
const contentsHandler = require('../core/contents');

function route_search (config, reffilePaths) {
  return function (req, res, next) {

    // Skip if Search not present
    if (!req.query.search) { return next(); }

    // remove < and >
    var tagFreeQuery   = _s.stripTags(req.query.search);

    // remove /, ', " and & from query
    var invalidChars   = '&\'"/';
    var sanitizedQuery = validator.blacklist(tagFreeQuery, invalidChars);

    // trim and convert to string
    var searchQuery    = validator.toString(sanitizedQuery).trim();

    var searchResults  = searchHandler(searchQuery, config);
    // var pageListSearch = remove_image_content_directory(config, contentsHandler(null, config));

    // TODO: Move to CSYCMS Core
    // Loop through Results and Extract Category
    searchResults.forEach(function (result) {
      result.category = null;
      var split = result.slug.split('/');
      if (split.length > 1) {
        result.category = split[0];
      }
      result.slug = result.slug.replace(/\/[0-9]+\./g, '/').replace(/^[0-9]+\./g, '')
      if(result.slug.substr(-5) === '/docs') result.slug = result.slug.substr(0, result.slug.length - 5)
      if(result.slug.substr(-8) === '/chapter') result.slug = result.slug.substr(0, result.slug.length - 8)
    });

    // // console.log("11111111111111111111111111111111111111111111111111111")
    // console.log(searchResults)
    // console.log("22222222222222222222222222222222222222222222222222222")
    // console.log(pageListSearch)
    // console.log("33333333333333333333333333333333333333333333")
    // pageListSearch = []
    return res.render('search', {
      config        : config,
      // pages         : pageListSearch,
      pages         : reffilePaths.nestedPages,
      search        : searchQuery,
      searchResults : searchResults,
      body_class    : 'page-search',
      lang          : config.lang,
      loggedIn      : ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false),
      username      : ((config.authentication || config.authentication_for_edit) ? req.session.username : null)
    });

  };
}

// Exports
module.exports = route_search;
