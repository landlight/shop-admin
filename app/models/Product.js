var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    name: {
        type: String,
        required: true
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
    price:{
        type: Number
    },
    priceType:{
        type: String
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
    ],
    productImage: {
        type: String,
        required: false,
    }
}, {
    collection: 'items'
});
var proudct = mongoose.model('products', Product);

module.exports = proudct;