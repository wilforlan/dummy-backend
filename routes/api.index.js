var express = require('express');
var router = express.Router();
var Authorization = require('../middlewares/authorization.middleware');
var Addons = require('../middlewares/addons.middleware');

var bikersApi = require('./bikers.route');
var usersApi = require('./users.route');


router.use(Addons.cache(process.env.CACHE_DURATION));

router.use("/users", usersApi);

router.use(Authorization.verifyToken);
router.use("/bikers", bikersApi);



module.exports = router;