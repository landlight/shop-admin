var Item = require('../models/Item');
var ItemService = require('../services/itemService');

const add = async (req, res) => {
    ItemService.checkAddRequest(req, res)
    .then(() => {
        var item = new Item(req.body);
        item.save()
            .then(item => {
                res.redirect('/');
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
    })
}

module.exports = {
    add
}