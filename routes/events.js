var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

router.get('/', (req, res) => {
  var id = req.user ? req.user.id : null;
  console.log('id is ' + id);

  db.getEvents(id, (error, result) => {
    if (error) {
      console.error(error);
      res.status(200).json([{}]);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
