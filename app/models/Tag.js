var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
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
    collection: 'tags'
});

module.exports = mongoose.model('tags', Tag);