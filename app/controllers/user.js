const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const json_response = require('../services/json_response');
const json_error = require('../services/json_error');
const pagingService = require('../services/paging');

const getUsers = async (req, res, next) => {
    try {
        let userCollection = db.get().collection('users');
        let { pageNo, pageSize } = pagingService.initializePaging(req.query.pageNo, req.query.pageSize);
        let skipValue = pagingService.getSkipValue(pageNo, pageSize);
        let sort = {_id: 1};
        let query = {};
        if (!req.query.all) {
            query = {deleted_at: {$exists: false}};
        }

        userCollection.find(query)
                      .sort(sort)
                      .skip(skipValue)
                      .limit(pageSize)
                      .toArray((err, users) => {
                          if (err) {
                              json_error.DefaultError(err, res);
                          }
                          return res.json(pagingService.pageResponse(pageNo, pageSize, users));
                      })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const getUser = async (req, res, next) => {
    try {
        if (req.params.userId) {
            return res.status(400).json(json_error.IsRequired('userId'));
        }
        let userCollection = db.get().collection('users');
        userCollection.findOne(
            {_id: ObjectId(req.params.userId)}, 
            (err, user) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                return res.json(pagingService.camelCase(user));
            })        
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        if (!req.params.userId) {
            return res.status(400).json(json_error.IsRequired('userId'));
        }
        let userCollection = db.get().collection('users');
        userCollection.updateOne(
            {_id: ObjectId(req.params.userId)}, 
            {$set: {deleted_at: true}},
            (err, updated) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                if (updated.modifiedCount == 1) {
                    return res.json(json_response.DefaultSuccess());
                } else if (updated.matchedCount == 1) {
                    return res.status(400).json({message: "User already deleted"});
                } else {
                    return res.status(400).json(json_error.NotFound('User'));    
                }
            });
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

module.exports = {
    getUsers,
    getUser,
    deleteUser
}