var json_error = require('../services/json_error');

const checkAddRequest = (req, res) => {
    if (!req.body.name){
        return res.json(json_error.NotFound('name'))
    }
    if (!req.body.name){
        return res.json(json_error.NotFound('name'))
    }
    if (!req.body.name){
        return res.json(json_error.NotFound('name'))
    }
    if (!req.body.name){
        return res.json(json_error.NotFound('name'))
    }
}


module.exports = {
    checkAddRequest
}