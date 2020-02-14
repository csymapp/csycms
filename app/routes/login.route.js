'use strict';
const passport = require('passport'),
  GitHubStrategy = require('passport-github').Strategy

  function route_login(config,  pageList, route_wildcard) {
    passport.use(new GitHubStrategy({
        clientID: config.oauth2.client_id,
        clientSecret: config.oauth2.client_secret,
        callbackURL: config.oauth2.callback
      },
      function (accessToken, refreshToken, profile, cb) {
        return cb({
          accessToken,
          refreshToken,
          profile
        });
      }
    ));
    return function (req, res, next) {
      let withcallback = req.params;
      let [err, care, dontcare] = []

      let __promisifiedPassportAuthentication = function () {
        return new Promise((resolve, reject) => {
          passport.authenticate('github', {}, (result) => {
            let {
              accessToken,
              refreshToken,
              profile
            } = result;
            console.log(result)
            if (result.status && result.status === 500) return reject(res.redirect('/login'))
            req.auth = result;
            if (!req.session) req.session = {}
            let emails = profile.emails;
            let domains = [];
            for (let i in emails) {
              domains.push(emails[i].value.split('@')[1])
            }
            let isWhiteListed = false;
            if (config.whitelisted.includes("*")) isWhiteListed = true;
            else {
              for (let i in domains) {
                if (config.whitelisted.includes(domains[i])) isWhiteListed = true;
              }
            }
            if (isWhiteListed) {
              req.session.accessToken = result.accessToken;
            }
            resolve(
              route_wildcard(req, res, next)
            )
          })(req, res, next)
        })
      }
      return __promisifiedPassportAuthentication().catch((err) => {
        console.log(err)
        throw (err)
      })
    };
  }

// Exports
module.exports = route_login;
