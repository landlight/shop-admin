var express = require('express');
var appRouter = express.Router();

let verify = require('../controllers/auth').verify;
let productRoutes = require('./product');
let categoryRoutes = require('./category');
let tagRoutes = require('./tag');
let userRoutes = require('./user');
let subCategoryRoutes = require('./subCategory');
let authRoutes = require('./auth');

appRouter.use('/auth', authRoutes);
appRouter.use('/user', verify, userRoutes);
appRouter.use('/product', verify, productRoutes);
appRouter.use('/category', verify, categoryRoutes);
appRouter.use('/subcategory', verify, subCategoryRoutes);
appRouter.use('/tag', verify, tagRoutes);

module.exports = appRouter;