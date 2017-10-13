var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

router.get('/', (req, res) => {
  var id = req.user ? req.user.id : null;

  db.getEvents(id, (error, result) => {
    if (error) {
      console.error(error);
      res.status(200).json([{}]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/count', (req, res) => {
  var id = req.user ? req.user.id : null;

  db.getEventsCount(id, (error, result) => {
    if (error) {
      console.error(error);
      res.status(200).json(0);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/update', (req, res) => {
  var id = req.user ? req.user.id : null;

  db.updateEventsStatus(id, (error, result) => {
    if (error) {
      console.error(error);
      res.status(200).json(0);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
