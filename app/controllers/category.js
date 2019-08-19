const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const json_error = require('../services/json_error');
const Category = require('../models/category');
const pagingService = require('../services/paging');
const stamperService = require('../services/stamper');

const createCategory = async (req, res, next) => {
    try {
        let categoryCollection = db.get().collection('categories');
        let category = Category.category;

        if (!req.body.name) {
            return res.status(400).json(json_error.IsRequired('name'));
        } 
        if (!req.body.description) {
            return res.status(400).json(json_error.IsRequired('description'));
        } 
        category.name = req.body.name;
        category.description = req.body.description;
        category._id = new ObjectId();
        category = stamperService.stamp(category);
        let promises = [];
        if (req.body.parentId) {   
            promises.push(new Promise((resolve, reject) => {
                categoryCollection.findOne({
                    _id: ObjectId(req.body.parentId)
                }, (err, parentCategory) => {
                    if (err) {
                        return reject(err);
                    }
                    if (!parentCategory) {
                        return reject('parentId not found');
                    }
                    return resolve(parentCategory._id);
                })
            }))
        }
        Promise.all(promises).then((results) => {
            if (results.length > 0) {
                category.parent_id = results[0];
            }
            categoryCollection.insertOne(category, 
                (err, insertedCategory) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                return res.json(pagingService.camelCase(insertedCategory.ops[0]));
            })
        }, (err) => {
            json_error.DefaultError(err, res);
        })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const getCategories = async (req, res, next) => {
    try {
        let categoryCollection = db.get().collection('categories');
        let { pageNo, pageSize } = pagingService.initializePaging(req.query.pageNo, req.query.pageSize);
        let skipValue = pagingService.getSkipValue(pageNo, pageSize);
        let sort = {_id: 1};
        let query = {};
        if (!req.query.all) {
            query = {deleted_at: {$exists: false}};
        }
        categoryCollection.find(query)
                        .sort(sort)
                        .skip(skipValue)
                        .limit(pageSize)
                        .toArray((err, categories) => {
                            if (err) {
                                json_error.DefaultError(err, res);
                            }
                            return res.json(pagingService.pageResponse(pageNo, pageSize, categories));
                        })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const getCategory = async (req, res, next) => {
    try {
        if (!req.params.categoryId) {
            return res.status(400).json(json_error.IsRequired('categoryId'));
        }
        let categoryCollection = db.get().collection('categories');
        categoryCollection.findOne(
            {_id: ObjectId(req.params.categoryId)}, 
            (err, category) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                if (!category) {
                    return res.status(400).json(json_error.NotFound('Category'));            
                }
                return res.json(pagingService.camelCase(category));
            })        
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory
}