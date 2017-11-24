var jwt = require('jsonwebtoken');
var Transformer = require('../utils/transformer.utils');

var JWT = {};

JWT.verifyToken = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json(Transformer.transformResponse(0, 'No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, verifyCallBack);

    function verifyCallBack(error, decoded) {
        if (error) {
            return res.status(401).json(Transformer.transformResponse(0, error.message));
        }
        res.decoded = decoded._doc;
        next();
    }
};

module.exports = JWT;