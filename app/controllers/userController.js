const json_error = require('../services/json_error');
const User = require('../models/User');

const signup = async (req, res, next) => {
    if (!req.body.email){
        return res.json(json_error.NotFound('email'));
    }
    if (!req.body.password){
        return res.json(json_error.NotFound('password'));
    }
    if (!req.body.username){
        return res.json(json_error.NotFound('username'));
    }
    return res.json({message: "success"})
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    User.find({})
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            console.log(results.length, "res");
            return res.json(paging.pageResponse(pageSize, results));
        });
    return res.json({message: "success"})
}

const getById = async (req, res, next) => {
    User.findOne({
        _id: ObjectId(req.params.userId)
    }, (err, result) => {
        if (err) 
            return next(err);
        return res.json(result);
    })
    return res.json({message: "success"});
};

module.exports = {
    signup,
    get,
    getById
}