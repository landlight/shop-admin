var categoryController = require('../controllers/category')

var express = require('express');
var categoryRouter = express.Router();

categoryRouter.route('/:categoryId')
    .get(categoryController.getCategory);

categoryRouter.route('/:categoryId')
    .put(categoryController.updateCategory);

categoryRouter.route('/:categoryId')
    .delete(categoryController.deleteCategory);

categoryRouter.route('/')
    .post(categoryController.createCategory);

categoryRouter.route('/')
    .get(categoryController.getCategories);

module.exports = categoryRouter;