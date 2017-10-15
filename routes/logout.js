var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

router.get('/', (req, res) => {
  console.log('auth?', req.isAuthenticated());
  req.session.destroy(function (err) {
    if (err) {
        return res.status(500).json({status: 'error', 'error': err});
    }

    res.status(200).clearCookie('connect.sid').json({status: 'Success'});
  });
  
});

module.exports = router;