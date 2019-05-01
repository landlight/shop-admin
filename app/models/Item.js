var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
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
    categories: [
        {
            type: Schema.ObjectId, 
            ref: 'categories'
        }
    ],
    tags: [
        {
            type: Schema.ObjectId,
            ref: 'tags'
        }
    ]
}, {
    collection: 'items'
});
var item = mongoose.model('items', Item);

module.exports = item;