var productController = require('../controllers/product');

var express = require('express');
var productRouter = express.Router();

productRouter.route('/:productId')
    .get(productController.getProduct);

productRouter.route('/:productId/tag')
    .post(productController.addProductTag);

productRouter.route('/:productId/tag')
    .delete(productController.deleteProductTag);

productRouter.route('/:productId/category')
    .post(productController.updateProductCategory);

productRouter.route('/:productId/category')
    .delete(productController.deleteProductCategory);

productRouter.route('/')
    .get(productController.getProducts);

productRouter.route('/')
    .post(productController.createProduct);

module.exports = productRouter;