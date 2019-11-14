
'use strict';

// Modules
const validator = require('validator')
  , _s = require('underscore.string')
  , remove_image_content_directory = require('../functions/remove_image_content_directory.js')
  , path = require('path')
  , searchHandler = require('../core/search')
  , contentsHandler = require('../core/contents')
  , to = require('await-to-js').to

function route_search(config, reffilePaths) {
  return async function (req, res, next) {

    // Skip if Search not present
    if (!req.query.search) { return next(); }

    // remove < and >
    let tagFreeQuery = _s.stripTags(req.query.search);

    // remove /, ', " and & from query
    let invalidChars = '&\'"/';
    let sanitizedQuery = validator.blacklist(tagFreeQuery, invalidChars);

    // trim and convert to string
    let searchQuery = validator.toString(sanitizedQuery).trim();

    const searchOtherSites = async (searchQuery, configfile) => {
      let rootPath = path.join(__dirname, '..', '..', 'bin')
      let iConfig = require(configfile)(rootPath)
      iConfig.content_dir = path.join(iConfig.content_dir, iConfig.site)
      let [err, ret] = await to(searchHandler(searchQuery, iConfig));
      return ret
    }

    let [err, searchResults] = await to(searchHandler(searchQuery, config));
    // console.log(searchResults)
    if (config.search_scope === 'global') {
      let configFiles = []
      for (let i in reffilePaths.otherSites) configFiles.push(reffilePaths.otherSites[i].config_file)
      let promises = configFiles.map(async function (configfile) { return await searchOtherSites(searchQuery, configfile) });
      let [err, care] = await to(Promise.all(promises));
      
      for (let i in care) {
        for (let j in care[i]) {
          searchResults.push(care[i][j])
        }
      }
    }
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
      if (result.slug.substr(-5) === '/docs') result.slug = result.slug.substr(0, result.slug.length - 5)
      if (result.slug.substr(-8) === '/chapter') result.slug = result.slug.substr(0, result.slug.length - 8)

      try {
        result.Oslug = result.Oslug.replace(/\/[0-9]+\./g, '/').replace(/^[0-9]+\./g, '')
        if (result.Oslug.substr(-5) === '/docs') result.Oslug = result.Oslug.substr(0, result.Oslug.length - 5)
        if (result.Oslug.substr(-8) === '/chapter') result.Oslug = result.Oslug.substr(0, result.Oslug.length - 8)
      } catch (error) { }


    });

    if (!req.session) req.session = {}

    let layout
      , theme = config.theme_name
      , render = layout = path.join(theme, 'templates', 'layout')
    render = path.join(theme, 'templates', 'search')
    render = path.join(config.site, theme, 'search')
    layout = path.join(config.site, theme, 'layout')
    return res.render(render, {
      config: config,
      // pages         : pageListSearch,
      pages: reffilePaths.nestedPages,
      search: searchQuery,
      searchResults: searchResults,
      body_class: 'page-search',
      lang: config.lang,
      loggedIn: ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false),
      username: ((config.authentication || config.authentication_for_edit) ? req.session.username : null)
      , layout
    });

  };
}

// Exports
module.exports = route_search;
