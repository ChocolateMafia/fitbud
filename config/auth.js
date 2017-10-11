// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth' : {
    'clientID'      : '163181767601135', // your App ID
    'clientSecret'  : '85a031b2667e9c2284f01185da1dc496', // your App Secret
    'callbackURL'   : `http://localhost:${process.env.PORT || 3001}/auth/facebook/callback`
  },

  'twitterAuth' : {
    'consumerKey'       : 'your-consumer-key-here',
    'consumerSecret'    : 'your-client-secret-here',
    'callbackURL'       : `http://localhost:${process.env.PORT || 3001}/auth/twitter/callback`
  },

  'googleAuth' : {
    'clientID'      : 'your-secret-clientID-here',
    'clientSecret'  : 'your-client-secret-here',
    'callbackURL'   : `http://localhost:${process.env.PORT || 3001}/auth/google/callback`
  }
};
