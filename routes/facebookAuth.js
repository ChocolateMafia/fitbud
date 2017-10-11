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
      console.log('user inside passport:', dbUserResult);
      if (err) { return done(err); }
      if (!dbUserResult) { return done(null, false); }
      db.comparePassword(password, dbUserResult[0].password, function(err, isMatch) {
        //console.log('inside passports compare password');
        if (err) {
          //console.log('cannot compare passwords');
        }
        if (isMatch) {
          return done (null, dbUserResult, {message: 'password matched'});
        } else {
          //console.log('checking for invalid password')
          return done(null, false, {message: 'invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  //console.log('user in serialize', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
  // console.log('in deserialize', id);
  // db.findById(id, function(err, user) {
  // // console.log('user in deserialize', user);
  //   done(err, user);
  //  });
});

// on success login, redirect to dashboards
// successRedirect:'/', 

  //passport.authenticate('facebook', { scope: 'email' }),
// on successful login
router.get('/',
  function(req, res) {
    console.log('faceboooooook login detected');
    // console.log('request inside login:', req)
    //console.log('cookies', req.cookies);
    // res.redirect('/dashboard');
    // console.log('auth user:', req.user);
    // res.json(req.user);
  });

// router.get('/callback', 
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   (req, res) => {
//     console.log('calllllllback  req');
//     res.json({username: 'kenny'});
//   });

// router.get('/', (req, res) => {
//   //console.log('login get')
//   res.end();
// });

module.exports = router;
//create register
//login 