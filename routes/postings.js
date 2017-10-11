var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

// /postings
router.get('/', (req, res) => {
  var id = req.user ? req.user.id : null;
  console.log('id is ' + id);

  db.getWorkouts(id, (result) => {
    res.status(200).json(result);
  });
});


router.post('/', (req, res) => {
  // var id = req.session.passport.user;
  console.log('session id in workout', req.user.id);
  var workoutObj = {
    title: req.body.title, 
    location: req.body.location, 
    date: req.body.date, 
    duration: req.body.duration, 
    details: req.body.details, 
    meetup_spot: req.body.meetup_point, 
    buddies: req.body.buddies,
    userId: req.user.id
  };

  db.createWorkout(workoutObj, (err, dbResult) => {
    res.status(201).send(dbResult);
  })
  
});

router.get('/:id', (req, res) => {
  //console.log('workout req query', req.params.id);
  db.getSingleWorkout(req.params.id, (result) => {
    //console.log('result of the get for a single workout', result);
    res.status(200).json(result);
  });
});

router.get('/requests/:id', (req, res) => {
  console.log('workout req query', req.params.id);
  db.getRequestsByPostingId(req.params.id, (result) => {
    //console.log('result of the get for a single workout', result);
    res.status(200).json(result);
  });
});

router.post('/:id', (req, res) => {
  //console.log('workout req body', req);
  var userId = req.user.id;
  var postingId = req.params.id;
  var reqObj = {
    postingId: postingId,
    userId: userId,
    status: 'pending'
  }

  db.createRequest(reqObj, (result) => {
    console.log('createRequest result:', result);
    var reqObjEvent = {
      author: userId,
      objectId: result.insertId,
      type: 'requests'
    }
    db.createEvent(reqObjEvent, (result) => {
      res.status(200).send('request created');
    })
  });
});

router.patch('/accept/:id', (req, res) => {
  var userId = req.params.id;
  var postingId = req.body.postingId;
  var reqObj = {
    postingId: postingId,
    userId: userId
  }
  db.updateRequest(reqObj, (result) => {
    var reqObjEvent = {
      author: userId,
      objectId: result.insertId,
      type: 'request'
    }
    db.createEvent(reqObjEvent, (result) => {
      res.status(200).send('request accepted');
    })
  });
});

module.exports = router;
