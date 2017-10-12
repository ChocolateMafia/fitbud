var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var configAuth = require('./../config/auth');

const createFBUser = (req, res, next) => {
  db.checkUser(req.body.username, function(err, result) {
    if (result) {
      next();
    } else {
      db.createUser({
        email: req.body.username, 
        name: req.body.name, 
        password: req.body.password,
        uid: req.body.uid,
        token: req.body.token,
        gender: req.body.gender,
        picture: req.body.picture        
      }, (err, result) => {
        err ? res.status(401).json({userCreated: false}) : next();
      });
    }
  });
};

router.post('/',
  createFBUser,
  passport.authenticate('local', {failureFlash: true, successFlash: true}),
  (req, res) => {
    res.json(req.user);
  }  
);

router.get('/', (req, res) => {
  res.end();
});

module.exports = router;
