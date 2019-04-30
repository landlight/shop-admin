var itemController = require('../controllers/itemController')

var express = require('express');
var itemRouter = express.Router();

itemRouter.route('/')
    .post(itemController.add);

itemRouter.route('/')
    .get(itemController.get);

itemRouter.route('/search')
    .get(itemController.search);

itemRouter.route('/addItem').get(function (req, res) {
    res.render('addItem');
});

module.exports = itemRouter;