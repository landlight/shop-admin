var Category = require('../models/Category'),
    paging = require('../services/paging'),
    json_error = require('../services/json_error');

const add = async (req, res, next) => {
    if (!req.body.name){
        return res.status(400).json(json_error.NotFound('name'));
    }
    if (!req.body.description){
        return res.status(400).json(json_error.NotFound('description'));
    }
    var category = new Category(req.body);
        category.save()
            .then(category => {
                res.json(category);
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    Category.find({})
            .populate('parent_id')
            .limit(pageSize)
            .exec(function (err, results) {
                if(err) return next(err);
                return res.json(paging.pageResponse(pageSize,results));
            });
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
                        "display_name": {
                            '$regex': keyword
                        }
                    },
                    {
                        "email": {
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
    search,
    remove
}