const authController = require('../controllers/auth');

var express = require('express');
var authRouter = express.Router();

authRouter.route('/signup')
          .post(authController.signUp);

authRouter.route('/login')
          .post(authController.login);

authRouter.route('/logout')
          .get(authController.logout);

module.exports = authRouter;
