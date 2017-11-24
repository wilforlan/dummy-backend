var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestsSchema = new Schema({
    created_by: { type: Schema.ObjectId, ref: 'Users' },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    ride_in_group: {
        type: String,
        enum: ['Always', 'Sometimes', 'Never'],
        required: true
    },
    days_of_week: {
        type: Array,
        required: true
    }
}, {
    collection: 'bikers',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Bikers = mongoose.model("Bikers", requestsSchema);
module.exports = Bikers;