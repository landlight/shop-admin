var userController = require('../controllers/user')

var express = require('express');
var userRouter = express.Router();

userRouter.route('/')
    .get(userController.getUser);

module.exports = userRouter;