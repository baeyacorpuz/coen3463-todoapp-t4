var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var timestamps = require('mongoose-timestamp');
var tasks = require('./tasks');
mongoose.Promise = Promise;

var usersSchema = new Schema
(
    {
       	username: {type:String, required: true},
        tasks: [{
            type: Schema.Types.ObjectId,
            ref: 'tasks'
        }],
    },
    {
        collection: 'users'
    }
);

usersSchema.plugin(passportLocalMongoose);
usersSchema.plugin(timestamps);

module.exports = mongoose.model('users', usersSchema);