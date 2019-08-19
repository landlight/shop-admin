var express = require('express');
var appRouter = express.Router();

let verify = require('../controllers/auth').verify;

let productRoutes = require('./product');
let categoryRoutes = require('./category');
let userRoutes = require('./user');
let authRoutes = require('./auth');

appRouter.use('/auth', authRoutes);
appRouter.use('/user', verify, userRoutes);
appRouter.use('/product', verify, productRoutes);
appRouter.use('/category', verify, categoryRoutes);

module.exports = appRouter;