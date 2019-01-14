'use strict';

// Modules
const 
  path          = require('path')
, express       = require('express')
, favicon       = require('serve-favicon')
, logger        = require('morgan')
, cookie_parser = require('cookie-parser')
, body_parser   = require('body-parser')
, moment        = require('moment')
, hogan         = require('hogan-express')
, session       = require('express-session')
, passport      = require('passport')
, dotenv        = require('dotenv')
, fse           = require('fs-extra')
, csystem         = require(__dirname+'/core/csystem')

function initialize (config) {
  dotenv.config()
  // Load Translations
  if (!config.locale) { config.locale = 'en'; }
  if (!config.lang) {
    config.lang = require('./translations/' + config.locale + '.json');
  }

  // Content_Dir requires trailing slash
  let pageList = csystem.loadPagesList(config.content_dir)
  // load contents of config_dir

  if (config.content_dir[config.content_dir.length - 1] !== path.sep) { config.content_dir += path.sep; }

  console.log('opening files...')
  // Load Files
  var authenticate              = require('./middleware/authenticate.js')               (config, pageList);
  var always_authenticate       = require('./middleware/always_authenticate.js')        (config, pageList);
  var authenticate_read_access  = require ('./middleware/authenticate_read_access.js')  (config, pageList);
  var error_handler             = require('./middleware/error_handler.js')              (config, pageList);
  var oauth2                    = require('./middleware/oauth2.js');
  var route_login               = require('./routes/login.route.js')                    (config, pageList);
  var route_login_page          = require('./routes/login_page.route.js')               (config, pageList);
  var route_logout              = require('./routes/logout.route.js');
  var route_page_edit           = require('./routes/page.edit.route.js')                (config, pageList);
  var route_page_delete         = require('./routes/page.delete.route.js')              (config, pageList);
  var route_page_create         = require('./routes/page.create.route.js')              (config, pageList);
  var route_category_create     = require('./routes/category.create.route.js')          (config, pageList);
  var route_search              = require('./routes/search.route.js')                   (config, pageList);
  var route_home                = require('./routes/home.route.js')                     (config, pageList);
  var route_wildcard            = require('./routes/wildcard.route.js')                 (config, pageList);
  var route_sitemap             = require('./routes/sitemap.route.js')                  (config, pageList);

  // New Express App
  var app = express();
  var router = express.Router();

  // Setup Port
  app.set('port', process.env.PORT || 3000);

  // set locale as date and time format
  moment.locale(config.locale);

  // Setup Views
  if (!config.theme_dir)  { config.theme_dir  = path.join(__dirname, '..', 'themes'); }
  if (!config.theme_name) { config.theme_name = 'default'; }
  if (!config.public_dir) { config.public_dir = path.join(config.theme_dir, config.theme_name, 'public'); }
  app.set('views', path.join(config.theme_dir, config.theme_name, 'templates'));
  app.set('layout', 'layout');
  app.set('view engine', 'html');
  app.enable('view cache');
  app.engine('html', hogan);

  // Setup Express
  app.use(favicon(config.public_dir + '/favicon.ico'));
  app.use(logger('dev'));
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended : false }));
  app.use(cookie_parser());
  app.use(express.static(config.public_dir));
  if (config.theme_dir !== path.join(__dirname, '..', 'themes')) {
    router.use(express.static(path.join(config.theme_dir, config.theme_name, 'public')));
  }
  router.use(config.image_url, express.static(path.normalize(config.content_dir + config.image_url)));
  router.use('/translations',  express.static(path.normalize(__dirname + '/translations')));

  // HTTP Authentication
  if (config.authentication === true || config.authentication_for_edit || config.authentication_for_read) {
    app.use(session({
      secret            : config.secret,
      name              : 'CSYCMS.sid',
      resave            : false,
      saveUninitialized : false
    }));
    app.use(authenticate_read_access);
    // OAuth2
    if (config.googleoauth === true) {
      app.use(passport.initialize());
      app.use(passport.session());
      router.use(oauth2.router(config));
      app.use(oauth2.template);
    }

    router.post('/rn-login', route_login);
    router.get('/logout', route_logout);
    router.get('/login',     route_login_page);
  }

  // Online Editor Routes
  if (config.allow_editing === true) {

    var middlewareToUse = authenticate;
    if (config.authentication_for_edit === true) {
      middlewareToUse = always_authenticate;
    }
    if (config.googleoauth === true) {
      middlewareToUse = oauth2.required;
    }

    router.post('/rn-edit',         middlewareToUse, route_page_edit);
    router.post('/rn-delete',       middlewareToUse, route_page_delete);
    router.post('/rn-add-page',     middlewareToUse, route_page_create);
    router.post('/rn-add-category', middlewareToUse, route_category_create);

  }

  // Router for / and /index with or without search parameter
  if (config.googleoauth === true) {
    router.get('/:var(index)?', oauth2.required, route_search, route_home);
    router.get(/^([^.]*)/, oauth2.required, route_wildcard);
  } else if (config.authentication_for_read === true) {
    router.get('/sitemap.xml', authenticate, route_sitemap);
    router.get('/sitemap', authenticate, route_sitemap);
    router.get('/:var(index)?', authenticate, route_search, route_home);
    router.get(/^([^.]*)/, authenticate, route_wildcard);
  } else {
    router.get('/sitemap.xml', route_sitemap);
    router.get('/sitemap', route_sitemap);
    router.get('/:var(index)?', route_search, route_home);
    router.get(/^([^.]*)/, route_wildcard);
  }

  // Handle Errors
  app.use(error_handler);
  app.use(config.prefix_url || '/', router);
  return app;

}

// Exports
module.exports = initialize;
