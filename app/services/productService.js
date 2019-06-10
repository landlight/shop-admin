var json_error = require('../services/json_error');
var ObjectId = require('mongodb').ObjectID;

const checkAddRequest = (req, res) => {
    return new Promise(function(resolve, reject) {
    	// Do async job
        if (!req.body.name){
            reject(json_error.NotFound('name'))
        }else if (!req.body.description){
            reject(json_error.NotFound('description'))
        }else if (!req.body.price){
            reject(json_error.NotFound('price'))
        }else if (!req.body.priceType){
            reject(json_error.NotFound('priceType'))
        }else {
            let categories = [];
            if (req.body.categories){
                for(var i in req.body.categories){
                    categories.push(ObjectId(req.body.categories[i]));
                }   
            }
            req.body.categories = categories;
            let tags = [];
            if (req.body.tags){
                for(var i in req.body.tags){
                    tags.push(ObjectId(req.body.tags[i]));
                }   
            }
            req.body.tags = tags;
            if (req.file){
                req.body.productImage = req.file.path;
            }
            resolve(req.body);
        }
    })
}

module.exports = {
    checkAddRequest
}