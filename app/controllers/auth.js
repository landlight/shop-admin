const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const json_error = require('../services/json_error');
const stamperService = require('../services/stamper');
const pagingService = require('../services/paging');

const signUp = async (req, res, next) => {
    try {
        if (!req.body.email){
            return res.status(400).json(json_error.IsRequired('email'));
        }
        if (!req.body.password){
            return res.status(400).json(json_error.IsRequired('password'));
        }
        if (!req.body.role || (req.body.role < 1 || req.body.role > 3)){
            return res.status(400).json(json_error.OutOfBound('role', 1, 3));
        }
        let role = !req.body.role ? 1: req.body.role;
        let username = !req.body.username ? req.body.email: req.body.username;
        let password = req.body.password;
        let userCollection = db.get().collection('users');
        userCollection.findOne(
            { email: username }, 
            (err, user) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                if (user) {
                    return res.status(400).json("User already exists!");
                }
                bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                        if (err) 
                            return next(err);
                        let new_user = {
                            email: req.body.email,
                            username: username,
                            password: hash,
                            role: role
                        }
                        new_user = stamperService.stamp(new_user);
                        userCollection.insertOne(new_user, (err, insertedUser) => {
                            if (err) {
                                json_error.DefaultError(err, res);
                            }
                            let user = insertedUser.ops[0];
                            delete user.password;
                            return res.json(pagingService.camelCase(user));
                        })
                    }
                );
            })
    } catch(err) {
        json_error.DefaultError(err, res);
    }
}

const login = async (req, res, next) => {
    try {
        if (!req.body.email) {
            return res.status(401).json(json_error.NotAuthorized());
        }
        if (!req.body.password) {
            return res.status(401).json(json_error.NotAuthorized());
        }
        let userCollection = db.get().collection('users');
        userCollection.findOne(
            {email: req.body.email}, 
            (err, user) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                if (!user) {
                    return res.status(401).json(json_error.NotAuthorized());
                }
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) {
                        json_error.DefaultError(err, res);
                    }
                    if (!isMatch) {
                        return res.status(401).json(json_error.NotAuthorized());
                    }
                    return res.json({message: "success"})
                })
            }
        )
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const logout = async (req, res, next) => {
    console.log("logout");
}

module.exports = {
    signUp,
    login,
    logout
}