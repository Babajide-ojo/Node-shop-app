const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');

const CustomerSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type:String
    },
    password: {
        type: String
    },
    phone_number: {
        type: String
    }
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);