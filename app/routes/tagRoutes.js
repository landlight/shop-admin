var tagController = require('../controllers/tagController')

var express = require('express');
var tagRouter = express.Router();

tagRouter.route('/')
    .post(tagController.add);

tagRouter.route('/')
    .get(tagController.get);

module.exports = tagRouter;