var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var bcrypt = require('bcrypt');

router.get('/:ownerId', (req, res) => {
  db.findById(req.params.ownerId, (err, user) => {
    if (user.id === req.user) {
      user.friendship = null;
    } else {
      db.getFriendshipStatus(req.user.id, user.id, (err, friendships) => {
        console.log('frienship', friendships);
        if (friendships.length === 0) {
          user.friendship = null;
        } else {
          user.friendship = friendships[0].status;
        }
        err ? res.status(400).json() : res.json(user);
      });
    }
  });
});

router.post('/', (req, res) => {
  var userId = req.session.passport.user;
  var profileObj = {
    name: req.body.name,
    email: req.body.username,
    gender: req.body.gender,
    age: parseInt(req.body.age, 10)
  };

  console.log(userId);
  console.log(profileObj);

  if (req.body.password) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        profileObj.password = hash;
        db.updateUser(userId, profileObj, (err, result) => {
          console.log(result);
          if (err) {
            res.status(400).send();
          } else {
            res.json(result);
          }
        });
      });
    });
  } else {
    db.updateUser(userId, profileObj, (err, result) => {
      console.log(result);
      if (err) {
        res.status(400).send();
      } else {
        res.json(result);
      }
    });
  }
});

module.exports = router;