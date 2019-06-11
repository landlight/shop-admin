var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JwtBlackList = new Schema({
    token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'jwtblacklist'
});

module.exports = mongoose.model('jwtblacklist', JwtBlackList);
