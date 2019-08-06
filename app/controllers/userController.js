const json_error = require('../services/json_error');
const json_response = require('../services/json_response');
const User = require('../models/User');
const BlackList = require('../models/BlackList')
const paging = require('../services/paging');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async (req, res, next) => {
    if (!req.body.email){
        return res.json(json_error.IsRequired('email'));
    }
    if (!req.body.password){
        return res.json(json_error.IsRequired('password'));
    }
    if (req.body.role < 1 || req.body.role > 3){
        return res.json(json_error.OutOfBound('role', 0, 3));
    }
    let role = !req.body.role ? 1: req.body.role;
    let username = !req.body.username ? req.body.email: req.body.username;
    let password = req.body.password
    bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
        if (err) 
            return next(err);
        let new_user = {
            email: req.body.email,
            username: username,
            password: hash,
            role: role
        }
        let user = new User(new_user);
        user.save()
            .then(product => {
                res.json(pagin.pageResponse(product));
            })
            .catch(err => {
                res.status(400).json({error: err});
            });
    });
}

const login = async (req, res, next) => {
    if (!req.body.username){
        return res.json(json_error.IsRequired('username'));
    }
    if (!req.body.password){
        return res.json(json_error.IsRequired('password'));
    }
    User.findOne({
        $or: [
            {
                display_name: req.body.username
            },
            {
                email: req.body.username
            }
        ]
    }, async (err, user) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json(json_error.Invalidate());
        }
        const password = req.body.password;
        user.comparePassword(password, (err, isMatch) => {
            if (err)
                return next(err);
            if (isMatch) {
                let payload = {
                    user_id: user.id,
                    user_role: user.role
                };
                var token = jwt.sign(payload, process.env.SECRET);
                
                res.status(200).json({
                    token
                })
            }else {
                return res.status(401).json(json_error.Invalidate());
            }
        })
    })
}

const verify = async (req, res, next) => { 
    try{
        if (!req.headers.authorization) {
            return res.status(401).json(json_error.NotAuthorized());
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                return res.json(401).json(json_error.NotAuthorized());
            }
            if (payload) {
                BlackList.findOne({token: token}, (err, blacklist) => {
                    if (err)
                    return next(err);
                    if (blacklist){
                        return res.status(401).json(json_error.NotAuthorized());
                    } else {
                        User.findById(payload.user_id, (err, user) => {
                            if (err)
                                return next(err);
                            if (user)
                                req.user = user;
                                next();
                        })
                    }  
                })                
            } else {
                return res.json(401).json(json_error.NotAuthorized());
            }
        })
    }catch(error){
        return res.json(401).json(json_error.NotAuthorized());
    }
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    User.find({})
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            return res.json(paging.pageResponse(pageSize, results));
        });
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

const logout = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];  
        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                return res.json(401).json(json_error.NotAuthorized());
            }
            if (payload) {
                User.findById(payload.user_id).then(
                    (user) => {
                        req.user = user;
                        let blacklistPromise = blacklist(token);
                        blacklistPromise.then( (blacklisted) => {
                            if (blacklisted)
                                return res.json(json_response.DefaultSuccess());
                        }, (err) => {
                            return res.status(500).json(err);
                        })
                    }
                )
            } else {
                return res.json(401).json(json_error.NotAuthorized());
            }
        })
    }catch(error){
        return res.json(401).json(json_error.NotAuthorized());
    }
}

const blacklist = async (token) => {
    return new Promise(function(resolve, reject) {
        let blackListObject = { token: token };
        let blacklist = new BlackList(blackListObject);
        blacklist.save()
        .then(blacklisted => {
            resolve(blacklisted);
        })
        .catch(err => {
            reject(err)
        });
    });
}

module.exports = {
    signup,
    get,
    getById,
    login,
    verify,
    logout
}