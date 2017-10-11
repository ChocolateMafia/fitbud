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
  var id = req.user.id;
  var reqObj = {
    postingId: req.params.id,
    userId: id,
    status: 'pending'
  }
  var reqObjEvent = {
    userId: id,
    type: 'request',
    description: `User ${req.user.name} requested to join your workout` 
  }

  db.createRequest(reqObj, (result) => {
    db.createEvent(reqObjEvent, (result) => {
      res.status(200).send('request created');
    })
    //console.log('request created in the table', result);
  });
});

router.patch('/accept/:id', (req, res) => {
  var id = req.params.id;
  var reqObjEvent = {
    userId: id,
    type: 'request',
    description: `User accepted your request` 
  }
  db.updateRequest(id, (result) => {
    //console.log('request created in the table', result);
    db.createEvent(reqObjEvent, (result) => {
      res.status(200).send('request accepted');
    })
  });
});

module.exports = router;
