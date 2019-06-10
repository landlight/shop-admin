var userController = require('../controllers/userController')

var express = require('express');
var userRouter = express.Router();

userRouter.route('/signup')
          .post(userController.signup);
          
userRouter.route('/')
    .get(userController.get);

module.exports = userRouter;