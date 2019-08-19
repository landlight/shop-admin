const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const json_error = require('../services/json_error');
const Product = require('../models/product');
const pagingService = require('../services/paging');
const stamperService = require('../services/stamper');
const productService = require('../services/product');

const createProduct = async (req, res, next) => {
    try {
        let productCollection = db.get().collection('products');
        let product = Product.product;
        if (!req.body.name) {
            return res.status(400).json(json_error.IsRequired('name'));
        } 
        if (!req.body.description) {
            return res.status(400).json(json_error.IsRequired('description'));
        } 
        if (!Number.isInteger(parseInt(req.body.price))) {
            return res.status(400).json(json_error.IsRequired('price'));
        }
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = parseInt(req.body.price);
        product.priceType = req.body.priceType; // need to refactor;
        product._id = new ObjectId;
        product = stamperService.stamp(product);
        
        productCollection.insertOne(product, 
            (err, insertedProduct) => {
            if (err) {
                json_error.DefaultError(err, res);
            }
            return res.json(pagingService.camelCase(insertedProduct.ops[0]));
        })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const getProducts = async (req, res, next) => {
    try {
        let productCollection = db.get().collection('products');
        let { pageNo, pageSize } = pagingService.initializePaging(req.query.pageNo, req.query.pageSize);
        let skipValue = pagingService.getSkipValue(pageNo, pageSize);
        let sort = {_id: 1};
        let query = {};
        if (!req.query.all) {
            query = {deleted_at: {$exists: false}};
        }
        productCollection.find(query)
                      .sort(sort)
                      .skip(skipValue)
                      .limit(pageSize)
                      .toArray((err, products) => {
                          if (err) {
                              json_error.DefaultError(err, res);
                          }
                          return res.json(pagingService.pageResponse(pageNo, pageSize, products));
                      })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const getProduct = async (req, res, next) => {
    try {
        if (!req.params.productId) {
            return res.status(400).json(json_error.IsRequired('productId'));
        }
        let productCollection = db.get().collection('products');
        productCollection.findOne(
            {_id: ObjectId(req.params.productId)}, 
            (err, product) => {
                if (err) {
                    json_error.DefaultError(err, res);
                }
                if (!product) {
                    return res.status(400).json(json_error.NotFound('Product'));
                }
                return res.json(pagingService.camelCase(product));
            })        
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const addProductTag = async (req, res, next) => {
    try {
        if (!req.params.productId) {
            return res.status(400).json(json_error.IsRequired('productId'));
        }
        if (!req.body.tag) {
            return res.status(400).json(json_error.IsRequired('tag'));
        }
        let addPromise = productService.manageProductTag(req.params.productId, req.body.tag, true);
        addPromise.then((result) => {
            return res.json({message: result});
        }, (err) => {
            json_error.DefaultError(err, res);
        })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

const deleteProductTag = async (req, res, next) => {
    try {
        if (!req.params.productId) {
            return res.status(400).json(json_error.IsRequired('productId'));
        }
        if (!req.body.tag) {
            return res.status(400).json(json_error.IsRequired('tag'));
        }
        let deletePromise = productService.manageProductTag(req.params.productId, req.body.tag, false);
        deletePromise.then((result) => {
            return res.json({message: result});
        }, (err) => {
            json_error.DefaultError(err, res);      
        })
    } catch (err) {
        json_error.DefaultError(err, res);
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    addProductTag,
    deleteProductTag
}