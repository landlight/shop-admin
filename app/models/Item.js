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
            type: Schema.Types.ObjectId, 
            ref: 'categories'
        }
    ]
}, {
    collection: 'items'
});

module.exports = mongoose.model('items', Item);