var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

router.get('/:userId', (req, res) => {
  var userId = +req.params.userId;
  db.getUserFriendships(userId, (err, results) => {
    var friendsIds = results.filter(record => record.status === 'accept').map(record => {
      if (record.userId === userId) {
        return record.friendId;
      }
      if (record.friendId === userId) {
        return record.userId;
      }
    }).filter((id, index, array) => array.indexOf(id) === index);

    var requestersIds = results.filter(record => record.status === 'pending').reduce((arr, record) => {
      if (record.friendId === userId) {
        arr.push(record.userId);
      }
      return arr;
    }, []);


    db.findByIds(friendsIds, (err, friends) => {
      db.findByIds(requestersIds, (err, requesters) => {
        err ? res.status(400).send() : res.json({friends, requesters});
      });
    });

  });
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

router.post('/accept', (req, res) => {
  db.updateFriendshipStatus('accept', req.body.userId, req.body.friendId, (err, result) => {
    err ? res.status(400).send() : res.json();
  });
});

router.post('/reject', (req, res) => {
  db.updateFriendshipStatus('reject', req.body.userId, req.body.friendId, (err, result) => {
    err ? res.status(400).send() : res.json();
  });
});

module.exports = router;