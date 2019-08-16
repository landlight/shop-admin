var express = require('express');
var appRouter = express.Router();

let verify = require('../controllers/auth').verify;
let itemRoutes = require('./item');
let categoryRoutes = require('./category');
let tagRoutes = require('./tag');
let userRoutes = require('./user');
let subCategoryRoutes = require('./subCategory');
let authRoutes = require('./auth');

appRouter.use('/auth', authRoutes);
appRouter.use('/user', userRoutes);
appRouter.use('/item', verify, itemRoutes);
appRouter.use('/category', categoryRoutes);
appRouter.use('/subcategory', subCategoryRoutes);
appRouter.use('/tag', tagRoutes);

module.exports = appRouter;