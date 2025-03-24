const UserController = require('../controllers/user.controller');
const express = require('express');
const {verifyAccessToken} = require('../middlewares/verifyToken');


const router = express.Router();

router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);
router.route('/current').get(verifyAccessToken , UserController.getCurrent);



module.exports = router;

