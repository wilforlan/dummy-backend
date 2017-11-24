var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Users = mongoose.model("Users", usersSchema);
module.exports = Users;