var json_error = require('../services/json_error');

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
            resolve(req.body);
        }
    })
}

module.exports = {
    checkAddRequest
}