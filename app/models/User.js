var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String   
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
}, {
    collection: 'users'
});

module.exports = mongoose.model('users', Users);