var express = require('express');
var appRouter = express.Router();

let itemRoutes = require('./itemRoutes');
let categoryRoutes = require('./categoryRoutes');
let tagRoutes = require('./tagRoutes');
let userRoutes = require('./userRoutes');
let subCategoryRoutes = require('./subCategoryRoutes');
let userController = require('../controllers/userController');

appRouter.use('/user/', userRoutes);
appRouter.use('/item', userController.verify, itemRoutes);
appRouter.use('/category', userController.verify, categoryRoutes);
appRouter.use('/subcategory', userController.verify, subCategoryRoutes);
appRouter.use('/tag', userController.verify, tagRoutes);

module.exports = appRouter;