var Item = require('../models/Item'),
    ItemService = require('../services/itemService'),
    paging = require('../services/paging'),
    json_error = require('../services/json_error');

const add = async (req, res, next) => {
    let addRequestPromise= ItemService.checkAddRequest(req, res);
    addRequestPromise.then(function(reqItem) {
        var item = new Item(reqItem);
        item.save()
            .then(item => {
                res.json(item);
            })
            .catch(err => {
                res.status(400).json({error: err});
            });
    }, function(err){
        return res.status(err.code).json({error: err.error});
    });
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    Item.find({})
        .populate('categories', 'name')
        .populate('tags', 'name')
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            console.log(results.length, "res");
            return res.json(paging.pageResponse(pageSize, results));
        });
}

const getItemsByCategory = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);

    if (!req.body.categories || req.body.categories.length == 0){
        return res.status(400).json(json_error.NotFound('categories'));
    }

    let categories = req.body.categories;
    
    Item.find({categories: {$all: categories}})
        .limit(pageSize)
        .exec(function (err, results) {
            if(err) return next(err);
            return res.json(paging.pageResponse(pageSize, results));
        })
}

const search = async (req, res) => {
    let {pageSize} = paging.getPageSize(req);
    if (!req.query.keyword){
        return res.status(400).json(json_error.NotFound('keyword'));
    }
    if (req.query.keyword.length < 3){
        return res.status(400).json(json_error.AtLeast('keyword',3));
    }
    let keyword = `.*${req.query.keyword}.*`;
    Item.find({$or: [{
                        "name": {
                            '$regex': keyword
                        }
                    },
                    {
                        "description": {
                            '$regex': keyword
                        }
                    }
        ]})
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            return res.json(paging.pageResponse(pageSize,results));
        });

}

const remove = async (req, res) => {

}

module.exports = {
    add,
    get,
    getItemsByCategory,
    search,
    remove,
}