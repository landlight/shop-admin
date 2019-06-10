var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubCategory = new Schema({
    name: {
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
    category: {
        type: Schema.ObjectId,
        ref: 'categories'
    }
}, {
    collection: 'subcategories'
});

module.exports = mongoose.model('subcategories', SubCategory);