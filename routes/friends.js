var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

router.get('/:userId', (req, res) => {
  var userId = +req.params.userId;
  db.getUserFriendships(userId, (err, results) => {
    var friends = results.filter(record => record.status === 'accept').map(record => {
      if (record.userId === userId) {
        return record.friendId;
      }
      if (record.friendId === userId) {
        return record.userId;
      }
    }).filter((id, index, array) => array.indexOf(id) === index);

    var requesters = results.filter(record => record.status === 'pending').reduce((arr, record) => {
      if (record.friendId === userId) {
        arr.push(record.userId);
      }
      return arr;
    }, []);

    console.log('*********** friends: ', friends);
    console.log('*********** requesters: ', requesters);

    err ? res.status(400).send() : res.json({friends, requesters});
  });
  
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
  db.getFriendshipStatus(req.body.userId, req.body.friendId, (err, friendships) => {
    console.log('/friends -- friendships:', friendships);

    if (!friendships.length) {
      // create new frienship request entry
      db.addFriendRequest(req.body.userId, req.body.friendId, (err, result) => {
        err ? res.status(400).send() : res.json();
      });
    } else {
      // update existing friendship status to pending
      db.updateFriendshipStatus(req.body.status, req.body.userId, req.body.friendId, (err, result) => { 
        err ? res.status(400).send() : res.json();
      });
    }
  });
});

module.exports = router;