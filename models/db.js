var mongoose = require('mongoose');
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000, connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000, connectTimeoutMS : 30000
    }
  }
};

mongoose.connect('mongodb://module678:module678@ds143449.mlab.com:43449/team4-module678', options);
