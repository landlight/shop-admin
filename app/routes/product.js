var productController = require('../controllers/product');

var express = require('express');
var productRouter = express.Router();

productRouter.route('/:productId')
    .get(productController.getProduct);

productRouter.route('/')
    .get(productController.getProducts);

productRouter.route('/')
    .post(productController.createProduct);

module.exports = productRouter;