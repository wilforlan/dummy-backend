var express = require('express');
var router = express.Router();
var UsersController = require('../controllers/users.controller');


router
	.post('/login', UsersController.login);


module.exports = router;