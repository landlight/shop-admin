const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const json_error = require('../services/json_error');
const stamperService = require('../services/stamper');
const pagingService = require('../services/paging');
const MobileDetect = require('mobile-detect');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
const keys = ['keyboard cat'];

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
        console.log(username, 'username');
        userCollection.findOne(
            { email: username }, 
            (err, user) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                console.log(user, 'user');
                if (user) {
                    return res.status(400).json({message: "User already exists!"});
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
                            const mobileData = new MobileDetect(req.headers['user-agent']);
                            let rTokenCollection = db.get().collection('refresh_tokens');
                            var {refreshToken} = generateRefreshToken(user._id);
                            let current_time =  new Date();
                            current_time.setHours(current_time.getHours() + 720);
                            rTokenCollection.insertOne({
                                user_id: user._id,
                                role: user.role,
                                platform: mobileData.ua,
                                refresh_token: refreshToken,
                                created_at: new Date(),
                                updated_at: new Date(),
                                expired_at: current_time
                            }, (err, resultToken) => {
                                if (err) {
                                    return next(err);
                                }
                                let jwt_token = generateJWT(resultToken.insertedId, user._id, user.roles);
                                let refresh_item = resultToken.ops[0];
                                if (jwt_token) {
                                    var cookies = new Cookies(req, res, { keys: keys })
                                    cookies.set('jwt-token', jwt_token, { signed: true })
                                    return res.json(pagingService.camelCase({
                                        id: refresh_item._id,
                                        userId: user._id,
                                        user: user,
                                        role: user.role,
                                        token: jwt_token,
                                        refreshToken: refreshToken, 
                                        updatedAt: refresh_item.updated_at,
                                        createdAt: refresh_item.created_at
                                    }));
                                }else{
                                    return res.status(401).json(json_error.Unauthorized());
                                }
                            });
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
                    delete user.password;
                    const mobileData = new MobileDetect(req.headers['user-agent']);
                    let rTokenCollection = db.get().collection('refresh_tokens');
                    var {refreshToken} = generateRefreshToken(user._id);
                    let current_time =  new Date();
                    current_time.setHours(current_time.getHours() + 720);
                    rTokenCollection.insertOne({
                        user_id: user._id,
                        role: user.role,
                        platform: mobileData.ua,
                        refresh_token: refreshToken,
                        created_at: new Date(),
                        updated_at: new Date(),
                        expired_at: current_time
                    }, (err, resultToken) => {
                        if (err) {
                            return next(err);
                        }
                        let jwt_token = generateJWT(resultToken.insertedId, user._id, user.roles);
                        let refresh_item = resultToken.ops[0];
                        if (jwt_token) {
                            var cookies = new Cookies(req, res, { keys: keys })
                            cookies.set('jwt-token', jwt_token, { signed: true })
                            return res.json(pagingService.camelCase({
                                id: refresh_item._id,
                                userId: user._id,
                                user: user,
                                role: user.role,
                                token: jwt_token,
                                refreshToken: refreshToken, 
                                updatedAt: refresh_item.updated_at,
                                createdAt: refresh_item.created_at
                            }));
                        }else{
                            return res.status(401).json(json_error.Unauthorized());
                        }
                    });
                })
            }
        )
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const verify = async (req, res, next) => {
    try {
        //Request a header with the key of authorization
        let jwt_token = '';
        if (!req.headers['authorization']) {
            var cookies = new Cookies(req, res, { keys: keys })
            jwt_token = cookies.get('jwt-token', { signed: true })    
        } else {
            const bearHeader = req.headers['authorization'];
            jwt_token = bearHeader.split(' ')[1]; // check header
        }
        if (jwt_token == '') {
            return res.status(401).json(json_error.NotAuthorized());
        }
        jwt.verify(jwt_token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(401).json(json_error.NotAuthorized());
            } else { 
                req.login_user = authData;
                next();
            };
        });
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const logout = async (req, res, next) => {
    try {
        let jwt_token = '';
        if (!req.headers['authorization']) {
            var cookies = new Cookies(req, res, { keys: keys })
            jwt_token = cookies.get('jwt-token', { signed: true })    
        }else{
            const bearHeader = req.headers['authorization'];
            jwt_token = bearHeader.split(' ')[1]; 
        }
        console.log(jwt_token, "token");
        if (jwt_token == '') {
            return res.status(401).json(json_error.NotAuthorized());
        }
        jwt.verify(jwt_token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(401).json(json_error.NotAuthorized());
            } else {
                let collection = db.get().collection("refresh_tokens")
                collection.updateOne(
                    {_id: ObjectId(authData.refresh_token_id)},
                    {$set: {deleted_at: new Date()}
                }, (err, updated) => {
                    if (err)
                        return next(err);
                    if (updated.modifiedCount == 1) {
                        var cookies = new Cookies(req, res, { keys: keys })
                        cookies.set('jwt-token', '', { signed: true })
                        return res.json({message: "success"});
                    } else {
                        return res.status(401).json(json_error.NotAuthorized());
                    }
                })
            }
        });
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

function generateJWT(tokenId, userId, role) {
    let payload = {
        refresh_token_id: tokenId,
        user_id: userId,
        roles: role
    }
    return jwt.sign(payload
        , process.env.JWT_SECRET, {
            algorithm: `${process.env.ALGORITHM}`,
            expiresIn: `${process.env.TOKEN_LIFE}`
        });
}

const generateRefreshToken = (userId) => {
    var randomString = crypto.randomBytes(2).toString('hex'); // create 4 random string
    let refreshTokenString = userId + '_'+ new Date() + '_' + randomString;
    let refreshToken = crypto.createHash('sha256').update(refreshTokenString).digest('base64');
    return { refreshToken };
}

module.exports = {
    signUp,
    login,
    verify,
    logout
}