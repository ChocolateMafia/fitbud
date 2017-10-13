var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

// /postings
router.post('/', (req, res) => {
  var userId = req.body.userId;
  var postingId = req.body.postingId;
  console.log(req.body);
  var data = {
    name: req.body.name,
    date: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
    userId: userId,
    postingId: postingId
  };
  db.createMessage(data, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      var reqObjEvent = {
        author: userId,
        objectId: result.insertId,
        postingId: postingId,
        type: 'chat',
        status: 'new'
      };
      var dataToSend = result;
      db.createEvent(reqObjEvent, (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(200).send(dataToSend);
        } else {
          res.status(200).send(dataToSend);
        }
      });
    }
  });
});

router.get('/:id', (req, res) => {
  var postingId = req.params.id;
  db.getMessages(postingId, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    res.status(200).send(result);
  });
});

module.exports = router;