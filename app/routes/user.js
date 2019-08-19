var userController = require('../controllers/user')

var express = require('express');
var userRouter = express.Router();

userRouter.route('/')
    .get(userController.getUsers);

userRouter.route('/:userId')
    .get(userController.getUser);

userRouter.route('/:userId')
    .delete(userController.deleteUser);

module.exports = userRouter;