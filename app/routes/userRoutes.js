var userController = require('../controllers/userController')

var express = require('express');
var userRouter = express.Router();

userRouter.route('/signup')
          .post(userController.signup);

userRouter.route('/login')
          .post(userController.login);

userRouter.route('/logout')
          .get(userController.logout);

userRouter.route('/')
    .get(userController.get);

module.exports = userRouter;