var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var bcrypt = require('bcrypt');

router.get('/:ownerId', (req, res) => {
  // db.findById(req.params.ownerId, (err, user) => {
  //   if (user.id === req.user) {
  //     user.friendship = null;
  //   } else {
  //     db.getFriendshipStatus(req.user.id, user.id, (err, friendships) => {
  //       console.log('frienship', friendships);
  //       if (friendships.length === 0) {
  //         user.friendship = null;
  //       } else {
  //         user.friendship = friendships[0].status;
  //       }
  //       err ? res.status(400).json() : res.json(user);
  //     });
  //   }
  // });
});

router.post('/', (req, res) => {
  var userId = req.session.passport.user;
  console.log(req.body);

  db.getFriendshipStatus(req.body.userId, req.body.friendId, (err, friendships) => {
    console.log('/friends -- friendships:', friendships);
    res.send();
  });


  res.send();

});

module.exports = router;