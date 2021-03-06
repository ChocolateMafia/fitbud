var mysql = require('mysql');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var moment = require('moment');
var Pusher = require('pusher');

var connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: process.env.DBSERVER || 'localhost',
    user: process.env.DBUSER || 'root',
    password: process.env.DBPASSWORD || '',
    database: process.env.DBNAME || 'fitbud'
  });

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


var pusher = new Pusher({
  appId: '414562',
  key: '7f1979bc2b65ed9a895f',
  secret: '61950201d0e83697ec9d',
  cluster: 'us2',
  encrypted: true
});
var eventsChannel = 'events';

var createUser = function(userObj, callback) {
  var query = 'INSERT INTO users SET ?';
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userObj.password, salt, function(err, hash) {
      userObj.password = hash;
      connection.query(query, userObj, function(err, result) {
        if (err) {
          console.error('error inserting user');
          callback(err, null);
        } else {
          console.log('successfully added');
          callback(null, result);
        }
      });
    });
  });
};

var updateUser = function(userId, profileObj, callback) {
  var query = 'UPDATE users SET ? WHERE id = ?';
  connection.query(query, [profileObj, userId], function(err, result) {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      callback(null, result);
    }    
  });  
};

var checkUser = function(username, callback) {
  var query = 'SELECT * from users WHERE email = ?';
  connection.query(query, [username], function(err, dbUserResult) {
    if (err) {
      console.error('error when finding user', err);
      callback(err);
    } else {
      console.log('result of finding a user', dbUserResult);
      if (dbUserResult.length === 0) {
        callback(new Error("user not found"), null);
      } else {
        callback(null, dbUserResult);
      }
    }
  });
};

var addFriendRequest = function (userId, friendId, callback) {
  var query = 'INSERT INTO friendship SET ?';
  connection.query(query, {userId, friendId}, function(err, result) {
    if (err) {
      console.error('error inserting friendship');
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

var getFriendshipStatus = function (userId, friendId, callback) {
  var query = 'SELECT * from friendship WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)';

  connection.query(query, [userId, friendId, friendId, userId], function(err, results) {
    if (err) {
      console.error('error when finding friendship', err);
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

var getUserFriendships = function (userId, callback) {
  var query = 'SELECT * from friendship WHERE (userId = ? OR friendId = ?) AND (status != "reject")';

  connection.query(query, [userId, userId], function(err, results) {
    console.log('&&&&&&&&&&&&&&', results);
    if (err) {
      console.error('error when finding user friendships', err);
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

var updateFriendshipStatus = function (status, userId, friendId, callback) {
  var query = 'UPDATE friendship SET status = ? WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)';

  connection.query(query, [status, userId, friendId, friendId, userId], function(err, result) {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      callback(null, result);
    }  
  });
};

var comparePassword = function(passwordEntered, hash, callback) {
  console.log('inside compare password');
  bcrypt.compare(passwordEntered, hash, function(err, isMatch) {
    if (err) {
      return callback(err);

    }
    callback(null, isMatch);
  });
};

var findById = function(id, callback) {
  console.log('database finding by id');
  var query = 'SELECT * from users WHERE id = ?';
  connection.query(query, [id], function(err, dbResultArr) {
    if (err) {
      console.error('error when finding id');
      return callback(err, null);
    } else {
      //console.log('result of finding a id', dbResultArr[0]);
      callback(null, dbResultArr[0]);
    }
  });  
};

var findByIds = function(ids, callback) {
  console.log('database bulk ids search');
  
  if (!ids.length) { 
    return callback(null, []); 
  }

  var query = 'SELECT * FROM users WHERE id IN ( ? )';
  connection.query(query, [ids], function(err, dbResultArr) {
    if (err) {
      console.error('error when finding ids');
      callback(err);
    } else {
      callback(null, dbResultArr);
    }
  });  
};

var getWorkouts = function(id, callback) {
  var query = 'select posting.*, requests.status, (posting.buddies - 1) as modified_buddies \
               from (select users.name, users.id as ownerId, users.picture, postings.* from postings inner join users on postings.userId=users.id) as posting \
               left outer join requests \
               on requests.postingId=posting.id \
               AND requests.userId=?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('error getting postings');
    } else {
      console.log('DB POSTING RESULTS:', result);
      callback(result);
    }
  });
};

//get workout id, user associated with that posting
var getSingleWorkout = function(postingId, callback) {
  var query = 'select postings.*, users.name from postings inner join users on postings.userId=users.id where postings.id=?';
  connection.query(query, [postingId], (err, result) => {
    if (err) {
      console.error('error getting single posting');
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
      console.error('error creating workout', err);
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
      console.error('error creating profile');
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
      console.error('error creating message', err);
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
      console.error('error getting message', err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// send back user requests (accepts and pendings) by postings id 
var getUserPostings = function(userId, callback) {
  var query = 'select postings.*, users.name AS name From postings JOIN users on (postings.userId = users.id) WHERE postings.userId = ?';
  //var query = 'select * from postings where userId=?';
  // var query = 'select p.location, p.date, p.duration, p.details from postings p where userId=?'
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('error getting posting by userId');
    } else {
      console.log('success posting by userId:', result);
      callback(result);
    }
  });
};

var getRequestsByPostingId = function(postingId, callback) {
  var query = 'select r.id, r.postingId, r.userId, r.status, p.title,p.location, p.date, p.duration, u.name  from requests r join postings p on r.postingId = p.id join users u  on r.userId = u.id where r.postingId = ?';
  connection.query(query, [postingId], (err, result) => {
    if (err) {
      console.error('error getting posting by userId');
    } else {
      console.log('success posting by userId:', result);
      callback(result);
    }
  });
};


var getUserRequestPostings = function(userId, callback) {
//title, loation, date, duration
  var query = 'SELECT p.*, u.name, u.picture \
              FROM postings p \
              INNER JOIN users u on p.userId= u.id \
              INNER JOIN requests r ON r.postingId=p.id \
              WHERE r.status = "pending" and r.userId = ?';
  // var query = 'select p.title, p.meetup_spot, p.location, p.date, p.duration, p.details, p.id, p.userId \
  //             from requests r left join postings p on r.postingId = p.id where r.status = "pending" and r.userId = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('error getting requests by userId');
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
      console.error('error creating request', err);
    } else {
      console.log('created request:', result);
      callback(result);
    }
  });
};

//helper functions to work with events
//they return Promises
var getAuthorForEvent = function(authorId, postingId) {
  return new Promise((resolve, reject) => {
    if (authorId) {
      var query = `SELECT name, id FROM users WHERE id=${authorId}`;
    } else {
      var query = `SELECT name, users.id FROM users, postings WHERE postings.id=${postingId} AND postings.userId=users.id`;
    }
    return connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

var getRecipientsForEvent = function(authorId, objectId, postingId, type, status) {
  return new Promise((resolve, reject) => {
    var query;
    if (type === 'requests') {
      if (status === 'new') {
        query = `SELECT userId FROM postings WHERE id=${postingId}`;
      }
      if (status === 'accepted') {
        query = `SELECT userId FROM requests WHERE id=${objectId}`;
      }
    }
    if (type === 'chat') {
      query = `SELECT userId FROM requests WHERE postingId=${postingId}
        UNION SELECT userId FROM chat WHERE postingId=${postingId}
        UNION SELECT userId FROM postings WHERE id=${postingId}`;
    }
    return connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

var getPostingForEvent = function(objectId, postingId, type, status) {
  return new Promise((resolve, reject) => {
    if (type === 'requests') {
      var query = `SELECT postings.title FROM requests, postings WHERE requests.id=${objectId} and requests.postingId=postings.id`;
    } else {
      var query = `SELECT title FROM postings WHERE id=${postingId}`;
    } 
    return connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
//end of helpers

var createEvent = function(requestObj, callback) {
  //author: userId or null
  //objectId: requestId,
  //type: 'requests',
  //status: 'accepted'
  //postingId: postingId,
  var description = '';
  var title = '';
  var recipients;
  return getAuthorForEvent(requestObj.author, requestObj.postingId)
    .then((result) => {
      if (result.length) {
        var name = result[0].name;
        requestObj.author = result[0].id;
      } else {
        var name = 'Anonymous';
      }
      description += name;
      if (requestObj.type === 'requests') {
        if (requestObj.status === 'new') {
          description += ' asked to join';
        }
        if (requestObj.status === 'accepted') {
          description += ' accepted your request to join';
        }
      }
      if (requestObj.type === 'chat') {
        description += ' posted new message at';
      }
      return getPostingForEvent(requestObj.objectId, requestObj.postingId, requestObj.type, requestObj.status);
    })
    .then((result) => {
      title = result.length === 0 ? 'unknown workout' : result[0].title;
      description += ' ' + title;
      return getRecipientsForEvent(requestObj.author, requestObj.objectId, requestObj.postingId, requestObj.type, requestObj.status);
    })
    .then((result) => {
      recipients = result.reduce((acc, object) => {
        if (object.userId !== requestObj.author) {
          acc.push(object.userId);
        }
        return acc; 
      }, []);
      var promises = recipients.map((userId) => {
        var insertObj = {recipient: userId, author: requestObj.author, objectId: requestObj.objectId, type: requestObj.type, description: description};
        var query = 'INSERT INTO events SET ?';
        return new Promise((resolve, reject) => {
          connection.query(query, insertObj, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      });
      return Promise.all(promises);
    })
    .then((result) => {
      console.log('createEvent result', result);
      pusher.trigger(eventsChannel, 'event', {
        "message": recipients
      });
      callback(result);
    })
    .catch((error) => {
      console.log('error creating event', error);
    });
};

var createFriendshipEvent = function(author, friendId, objectId, type, status, callback) {
  var description = '';
  var title = '';
  var recipient;
  return getAuthorForEvent(author)
    .then((result) => {
      if (result.length) {
        var name = result[0].name;
      } else {
        var name = 'Anonymous';
      }
      description += name;
      if (status === 'new') {
        description += ' sent you friend request';
      } 
      if (status === 'accept') {
        description += ' accepted your friend request';
      }
      return new Promise((resolve, reject) => {
        var query = 'SELECT * from users WHERE id = ?';
        connection.query(query, friendId, function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    })
    .then((result) => {
      console.log('result', result);
      recipient = result[0].id;
      var insertObj = {recipient, author, objectId, type, description};
      var query = 'INSERT INTO events SET ?';
      return new Promise((resolve, reject) => {
        connection.query(query, insertObj, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    })
    .then((result) => {
      console.log('createEvent result', result);
      pusher.trigger(eventsChannel, 'event', {
        'message': [recipient]
      });
      callback(null, result);
    })
    .catch((error) => {
      console.log('error creating event', error);
      callback(error, null);
    });
};

var getEvents = function(userId, callback) {
  var query = `SELECT * FROM events WHERE recipient=${userId}`;
  connection.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

var getEventsCount = function(userId, callback) {
  var query = `SELECT COUNT(id) FROM events WHERE recipient=${userId} AND new=1`;
  connection.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      var count = result.length > 0 ? count = result[0]['COUNT(id)'] : count = 0;
      callback(null, count);
    }
  });
};

var updateEventsStatus = function(userId, callback) {
  var query = `UPDATE events SET new=0 WHERE recipient=${userId}`;
  connection.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

var createPair = function(requestObj, callback) {
  var query = 'INSERT INTO requests SET ?';
  connection.query(query, requestObj, (err, result) => {
    if (err) {
      console.error('error creating request');
    } else {
      console.log('created request:', result);
      callback(result);
    }
  });
};

var getUserAcceptPostings = function(userId, callback) {
  //var dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  var query = `SELECT p.*
    FROM requests r LEFT JOIN postings p ON r.postingId = p.id WHERE r.UserId = ? and r.status = ?
    UNION
    SELECT *
    FROM postings WHERE userId = ?`;
  connection.query(query, [userId, 'accept', userId], (err, result) => {
    if (err) {
      console.error('error getting accepted requests', err);
    } else {
      console.log('accepted requests', result);
      callback(result);
    }
  });
};

var updateRequest = function(requestObj, callback) {
  var query = 'update requests set status = ? where userId=? AND postingId=?';
  connection.query(query, ['accept', requestObj.userId, requestObj.postingId], (err, result) => {
    if (err) {
      console.error('error updating request');
    } else {
      console.log('updated request to accept!', result);
      callback(result);
    }
  });
};

var getWorkoutMembers = function (postingId, callback) {
  var query = 'SELECT userId FROM postings WHERE id = ? UNION SELECT userId FROM requests WHERE postingId = ? AND status = ?';

  connection.query(query, [postingId, postingId, 'accept'], (err, results) => {
    if (err) {
      console.error('error when finding workout listing memebers', err);
    } else {
      callback(null, results);
    }
  });
};

//insert into postings (title, location, date, duration, details, meetup_spot, buddies, userId) values ('hike', 'sf', '2017-01-01 00:00:00', 1, 'hike in muir woods', 'parking', 2, 1);

module.exports = {
  checkUser,
  updateUser,
  comparePassword,
  createUser,
  getWorkouts,
  getSingleWorkout,
  createWorkout,
  createProfile,
  findById,
  findByIds,
  getUserPostings,
  getUserRequestPostings,
  createRequest,
  createEvent,
  createFriendshipEvent,
  updateEventsStatus,
  getEvents,
  getEventsCount,
  createPair,
  getUserAcceptPostings,
  getRequestsByPostingId,
  updateRequest,
  createMessage,
  getMessages,
  addFriendRequest,
  updateFriendshipStatus,
  getFriendshipStatus,
  getUserFriendships,
  getWorkoutMembers
};



