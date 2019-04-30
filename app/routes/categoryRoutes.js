var categoryController = require('../controllers/categoryController')

var express = require('express');
var categoryRouter = express.Router();

categoryRouter.route('/')
    .post(categoryController.add);

module.exports = categoryRouter;