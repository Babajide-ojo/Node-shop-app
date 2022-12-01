const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vOrderSchema = new Schema({
  order_number: {
    type: String,
  },
  total_price: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  delivery_address: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  email: {
    type: String,
  },
  items: {
    type: Array,
  },
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = vAdmin = mongoose.model("vorder", vOrderSchema);
