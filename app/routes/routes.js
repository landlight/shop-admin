var express = require('express');
var appRouter = express.Router();

let verify = require('../controllers/auth').verify;
let itemRoutes = require('./itemRoutes');
let categoryRoutes = require('./categoryRoutes');
let tagRoutes = require('./tagRoutes');
let userRoutes = require('./userRoutes');
let subCategoryRoutes = require('./subCategoryRoutes');
let authRoutes = require('./auth');

appRouter.use('/auth', authRoutes);
appRouter.use('/user', userRoutes);
appRouter.use('/item', verify, itemRoutes);
appRouter.use('/category', categoryRoutes);
appRouter.use('/subcategory', subCategoryRoutes);
appRouter.use('/tag', tagRoutes);

module.exports = appRouter;