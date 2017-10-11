var mysql = require('mysql');
var bcrypt = require('bcrypt');


var connection = mysql.createConnection({
  host: process.env.DBSERVER || 'localhost',
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || '',
  database : 'fitbud'
});

connection.connect(function(err){
  if (err) {
    console.log('could not connect to db', err);
  } else {
    console.log('connected to db');
  }
});

var createUser = function(userObj) {
  var query = 'INSERT INTO users (name, email, password) values (?, ?, ?)';
  bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(userObj.password, salt, function(err, hash) {
            userObj.password = hash;
            connection.query(query, [userObj.name, userObj.username, userObj.password], function(err, result){
              if (err) {
                console.log('error inserting user');
              } else {
                console.log('successfully added');
              }
            })
        });
    });
}

var checkUser = function(username, callback) {
  var query = 'SELECT * from users WHERE email = ?';
  connection.query(query, [username], function(err, dbUserResult){
    if (err) {
      console.log('error when finding user', err);
    } else{
      console.log('result of finding a user', dbUserResult);
      if (dbUserResult.length === 0) {
        callback(err, null);
      }
      else callback(null, dbUserResult);
    }
  })
}

var comparePassword = function(passwordEntered, hash, callback) {
  console.log('inside compare password');
  bcrypt.compare(passwordEntered, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch)
  });
  
};

var findById = function(id, callback) {
  console.log('database finding by id');
  
  var query = 'SELECT * from users WHERE id = ?';
  connection.query(query, [id], function(err, dbResultArr){
    if (err) {
      console.log('error when finding id');
    } else {
      console.log('result of finding a id', dbResultArr[0]);
      callback(null, dbResultArr[0]);
    }
  })
  
}

var getWorkouts = function(id, callback) {
  var query = 'select posting.*, requests.status, (posting.buddies - 1) as modified_buddies \
               from (select users.name, users.id as ownerId, postings.* from postings inner join users on postings.userId=users.id) as posting \
               left outer join requests \
               on requests.postingId=posting.id \
               AND requests.userId=?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.log('error getting postings');
    } else {
      console.log('DB POSTING RESULTS:', result);
      callback(result);
    }
  });
}

//get workout id, user associated with that posting
var getSingleWorkout = function(postingId, callback){
  var query = 'select postings.*, users.name from postings inner join users on postings.userId=users.id where postings.id=?';
  connection.query(query, [postingId], (err, result) => {
    if (err) {
      console.log('error getting single posting');
    } else {
      console.log('SINGLE POSTING with username RESULT:', result);
      callback(result);
    }
  });
};

//'INSERT INTO posts SET ?', {title: 'test'},

var createWorkout = function(workoutObj, callback) {
  var query = 'INSERT INTO postings SET ?';
  connection.query(query, workoutObj, (err, result) => {
    if (err) {
      console.log('error creating workout', err);
    } else {
      console.log('created workout result:', result);
      callback(result);
    }
  });
};

var createProfile = function(profileObj, callback) {
  var query = 'INSERT INTO profile SET ?';
  connection.query(query, profileObj, (err, result) => {
    if (err) {
      console.log('error creating profile');
    } else {
      console.log('created profile result:', result);
      callback(result);
    }
  });
};

var createMessage = function(msgObj, callback) {
  var query = 'INSERT INTO chat SET ?'; 
  connection.query(query, msgObj, (err, result) => {
    if (err) {
      console.log('error creating message', err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};
var getMessages = function(postingId, callback) {
  var query = 'select chat.*, users.name AS userName From chat JOIN users on (chat.userId = users.id) WHERE chat.postingId = ? ORDER BY chat.date ASC';
  connection.query(query, [postingId], (err, result) => {
    if (err) {
      console.log('error getting message', err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
}

// send back user requests (accepts and pendings) by postings id 
var getUserPostings = function(userId, callback) {
  
  var query = 'select * from postings where userId=?';
  // var query = 'select p.location, p.date, p.duration, p.details from postings p where userId=?'
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.log('error getting posting by userId');
    } else {
      console.log('success posting by userId:', result);
      callback(result);
    }
  });
};

var getRequestsByPostingId = function(postingId, callback) {
  var query = 'select r.postingId, r.userId, r.status, p.title,p.location, p.date, p.duration, u.name  from requests r join postings p on r.postingId = p.id join users u  on r.userId = u.id where r.postingId = ?';
  connection.query(query, [postingId], (err, result) => {
    if (err) {
      console.log('error getting posting by userId');
    } else {
      console.log('success posting by userId:', result);
      callback(result);
    }
  });
};


var getUserRequestPostings = function(userId, callback) {
//title, loation, date, duration
  var query = 'select p.location, p.date, p.duration, p.details from requests r left join postings p on r.postingId = p.id where r.status = "pending" and r.userId = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.log('error getting requests by userId');
    } else {
      console.log('success requests by userId:', result);
      callback(result);
    }
  });
};

var createRequest = function(requestObj, callback) {
  var query = 'INSERT INTO requests SET ?';
  connection.query(query, requestObj, (err, result) => {
    if (err) {
      console.log('error creating request', err);
    } else {
      console.log('created request:', result);
      callback(result);
    }
  });
};

var createEvent = function(requestObj, callback) {
	var query = 'INSERT INTO events SET ?';
	connection.query(query, requestObj, (err, result) => {
		if (err) {
			console.log('error creating event', err);
		} else {
			console.log('created event:', result);
			callback(result);
		}
	});
};

var createPair = function(requestObj, callback) {
  var query = 'INSERT INTO requests SET ?';
  connection.query(query, requestObj, (err, result) => {
    if (err) {
      console.log('error creating request');
    } else {
      console.log('created request:', result);
      callback(result);
    }
  });
};

var getUserAcceptPostings = function(userId, callback) {
  var query = 'select p.location, p.date, p.duration, p.details from requests r left join postings p on r.postingId = p.id where r.UserId = ? and r.status = ?';
  connection.query(query, [userId, 'accept'], (err, result) => {
    if (err) {
      console.log('error getting accepted requests');
    } else {
      console.log('accepted requests', result);
      callback(result);
    }
  });
};


var updateRequest = function(userId, callback) {
  var query = "update requests set status = ? where userId=?";
  connection.query(query, ['accept', userId], (err, result) => {
    if (err) {
      console.log('error updating reqest');
    } else {
      console.log('updated request to accept!', result);
      callback(result);
    }
  });
};

//insert into postings (title, location, date, duration, details, meetup_spot, buddies, userId) values ('hike', 'sf', '2017-01-01 00:00:00', 1, 'hike in muir woods', 'parking', 2, 1);

module.exports = {
  checkUser,
  comparePassword,
  createUser,
  getWorkouts,
  getSingleWorkout,
  createWorkout,
  createProfile,
  findById,
  getUserPostings,
  getUserRequestPostings,
  createRequest,
  createEvent,
  createPair,
  getUserAcceptPostings,
  getRequestsByPostingId,
  updateRequest,
  createMessage,
  getMessages
};



