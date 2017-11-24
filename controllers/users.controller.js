var Transformer = require('../utils/transformer.utils')
var UsersModel = require('../models/users.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var Users = {};

Users.login = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    UsersModel.findOne({ email: email }, function(err, user) {
        if (err) {
            res.json(Transformer.transformResponse(0, "Could not login, Please try again"));
        } else {
            console.log(user)
            if (user) {
                if (bcrypt.compareSync(password, user.password) == false) {
                    return res.json(Transformer.transformResponse(0, "Incorrect password, please try again."));
                } else {
                    var token = jwt.sign(user, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60
                    });
                    delete user.password;
                    var payload = {};
                    payload.token = token;
                    payload.user = user;

                    res.json(Transformer.transformResponse(1, "ok", payload));
                }
            } else {
                res.json(Transformer.transformResponse(0, "Invalid Email, Please try again"));

            }
        }
    });
};

module.exports = Users;