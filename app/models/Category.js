var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
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
    },
    parent_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'categories'
    }
}, {
    collection: 'categories'
});

module.exports = mongoose.model('categories', Category);