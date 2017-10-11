DROP DATABASE IF EXISTS fitbud;

CREATE DATABASE fitbud;

USE fitbud;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS postings;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS events;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);


CREATE TABLE postings (
  id INT NOT NULL AUTO_INCREMENT,
  title varchar(50),
  location varchar(255) NOT NULL,
  date DATETIME,
  duration INT NOT NULL,
  details varchar(255) NOT NULL,
  meetup_spot varchar(255) NOT NULL,
  buddies INT NOT NULL,
  userId INT,
  
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE profile (
  id INT NOT NULL AUTO_INCREMENT,
  gender varchar(20), 
  activity varchar(255) NOT NULL,
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
  description varchar(255) NOT NULL,
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
  name varchar(200), 
  userId INT,  
  postingId INT,
  date DATETIME, 
  PRIMARY KEY (id),
  FOREIGN KEY (postingId) REFERENCES postings(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

select postings.*, users.name from postings inner join users on postings.userId=users.id where postings.id=3;



