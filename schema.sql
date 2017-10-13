DROP DATABASE IF EXISTS fitbud;

CREATE DATABASE fitbud;

USE fitbud;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS postings;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS events;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  uid VARCHAR(255),
  token VARCHAR(255),
  gender VARCHAR(50),
  picture VARCHAR(255),
  age INT,
  rating float(2,1),
  r_count INT DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE friendship (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  friendId INT NOT NULL,
  PRIMARY KEY (id, userId, friendId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (friendId) REFERENCES users(id)
);

CREATE TABLE postings (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50),
  location VARCHAR(255) NOT NULL,
  date DATETIME,
  duration INT NOT NULL,
  details VARCHAR(255) NOT NULL,
  meetup_spot VARCHAR(255) NOT NULL,
  buddies INT NOT NULL,
  userId INT,
  
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE profile (
  id INT NOT NULL AUTO_INCREMENT,
  gender VARCHAR(20), 
  activity VARCHAR(255) NOT NULL,
  userId INT,  
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE events (
  id INT NOT NULL AUTO_INCREMENT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author INT,
  recipient INT,
  objectId INT,
  type ENUM('requests', 'chat', 'postings'),
  description VARCHAR(255) NOT NULL,
  new BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
);

CREATE TABLE requests (
  id INT NOT NULL AUTO_INCREMENT,
  postingId INT, 
  userId INT,
  status ENUM('pending', 'accept', 'reject'),
  
  PRIMARY KEY (id),
  FOREIGN KEY (postingId) REFERENCES postings(id),
  FOREIGN KEY (userId) REFERENCES users(id)
  
);

CREATE TABLE chat (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(200), 
  userId INT,  
  postingId INT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (id),
  FOREIGN KEY (postingId) REFERENCES postings(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

select postings.*, users.name from postings inner join users on postings.userId=users.id where postings.id=3;



