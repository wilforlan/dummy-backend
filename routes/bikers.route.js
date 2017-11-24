var express = require('express');
var router = express.Router();
var BikersController = require('../controllers/bikers.controller');


router
	.get('/', BikersController.findAll)
	.post('/', BikersController.add)
	.put('/:id', BikersController.update)
	.delete('/:id', BikersController.delete);


module.exports = router;