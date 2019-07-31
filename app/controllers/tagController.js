var Tag = require('../models/Tag'),
    paging = require('../services/paging'),
    json_error = require('../services/json_error');

const add = async (req, res, next) => {
    if (!req.body.name){
        return res.status(400).json(json_error.IsRequired('name'));
    }
    var tag = new Tag(req.body);
         tag.save()
            .then(category => {
               return res.json(category);
            })
            .catch(err => {
                return next(err);
            });
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    Tag.find({})
            .populate('parent_id', `name`)
            .limit(pageSize)
            .exec(function (err, results) {
                if(err) return next(err);
                return res.json(paging.pageResponse(pageSize,results));
            });
}

module.exports = {
    add,
    get
}