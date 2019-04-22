var itemController = require('../controllers/itemController')

var express = require('express');
var itemRouter = express.Router();

itemRouter.route('/').get(function (req, res) {
    res.render('items');
});

itemRouter.route('/single').get(function (req, res) {
    res.render('singleItem');
});

itemRouter.route('/addItem').get(function (req, res) {
    res.render('addItem');
});

itemRouter.route('/add')
    .post(itemController.add);

module.exports = itemRouter;