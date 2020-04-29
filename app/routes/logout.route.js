
'use strict';

function route_logout (req, res, next) {
  if(!req.session)req.session = {}
  req.session.loggedIn = false;
  req.session.username = null;
  req.session.accessToken = null;
  let redirectUrl = req.query.redirectUrl || '/'
  res.redirect(redirectUrl);
}

// Exports
module.exports = route_logout;