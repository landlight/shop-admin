var express = require('express');
var appRouter = express.Router();

let itemRoutes = require('./itemRoutes')
let categoryRoutes = require('./categoryRoutes')
let tagRoutes = require('./tagRoutes')

appRouter.use('/item', itemRoutes);
appRouter.use('/category', categoryRoutes);
appRouter.use('/tags', tagRoutes);

module.exports = appRouter;