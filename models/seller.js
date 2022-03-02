const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');

const SellerSchema = new Schema({
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
    },
    image: 
        {
            type: String,
        }
      ,
    date: {
        type: Date,
        default: Date.now
      }
});

module.exports = Seller = mongoose.model('seller', SellerSchema);