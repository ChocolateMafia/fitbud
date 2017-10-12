var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var configAuth = require('./../config/auth');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('username and password:', username, password);

    db.checkUser(username, function (err, dbUserResult) { 
      if (err) { return done(err); }
      if (!dbUserResult) { return done(null, false); }

      db.comparePassword(password, dbUserResult[0].password, function(err, isMatch) {
        if (err) {
          console.error('cannot compare passwords');
        }
        if (isMatch) {
          return done(null, dbUserResult[0], {message: 'password matched'});
        } else {
          return done(null, false, {message: 'invalid password'});
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/',
  passport.authenticate('local', {failureFlash: true, successFlash: true}),
  function(req, res) {
    res.json(req.user);
  }
);

router.get('/', (req, res) => {
  res.end();
});

module.exports = router;