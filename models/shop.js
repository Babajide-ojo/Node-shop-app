const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');

const ShopSchema = new Schema({
    seller_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'seller'
    },
    shop_name: {
        type: String
    },
    shop_address: {
        type: String
    },
    shop_category: {
        type:String
    },
    shop_logo: {
        type: String
    },
    shop_contact: {
        type: String
    }
});

module.exports = Shop = mongoose.model('shop', ShopSchema);