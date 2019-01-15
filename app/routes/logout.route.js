
'use strict';

function route_logout (req, res, next) {
  if(!req.session)req.session = {}
  req.session.loggedIn = false;
  req.session.username = null;
  res.redirect('/login');
}

// Exports
module.exports = route_logout;
