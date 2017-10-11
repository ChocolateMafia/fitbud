import firebase from 'firebase';

// var config = {
//   apiKey: 'AIzaSyDUEf-0MaqRdvEBohGLToDACD9eDul3lvc',
//   authDomain: 'fitbud-72ff9.firebaseapp.com',
//   databaseURL: 'https://fitbud-72ff9.firebaseio.com',
//   projectId: 'fitbud-72ff9',
//   storageBucket: 'fitbud-72ff9.appspot.com',
//   messagingSenderId: '990274992056'
// };

var config = {
  apiKey: 'YOUR API KEY',
  authDomain: 'YOUR AUTH DOMAIN',
  databaseURL: 'YOUR DATABASE URL',
  storageBucket: 'YOUR STORAGE BUCKET',
  messagingSenderId: 'YOUR MESSAGING SENDER ID'
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const auth = firebase.auth;
export const facebookProvider = new firebase.auth.FacebookAuthProvider();