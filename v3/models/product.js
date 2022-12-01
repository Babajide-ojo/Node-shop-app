const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vProductSchema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  size: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  image_url_two: {
    type: String,
  },
  image_url_one: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  product_id: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = vAdmin = mongoose.model("vproduct", vProductSchema);
