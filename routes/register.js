var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', function (req, res) {
  db.checkUser(req.body.username, function(err, result) {
    if (result) {
      res.status(409).json({userExists: true});
    } else {
      db.createUser({email: req.body.username, name: req.body.name, password: req.body.password}, (err, result) => {
        if (!err) {
          res.status(200).json({userCreated: true});
        } else {
          res.status(401).json({userCreated: false});
        }
      });
    }
  });
});

module.exports = router;