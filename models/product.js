const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_name: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  image_url: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);
