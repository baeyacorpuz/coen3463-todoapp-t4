var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
var users = require('./users');

mongoose.Promise = Promise;

var tasksSchema = new Schema
(
    {
        name: {type:String},
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        isComplete : {type : Boolean, default : false}
    },
    {
        collection: 'tasks'
    }
);

tasksSchema.plugin(timestamps);

module.exports = mongoose.model('tasks', tasksSchema);