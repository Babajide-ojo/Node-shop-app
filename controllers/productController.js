const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");

const Product = require("../models/product");

exports.createProduct = (req, res) => {
  let { product_name, category, description, manufacturer } = req.body;
  let image_url = req.files.image_url[0].path;

  console.log(image_url);
  //req body validation
  if (!product_name) {
    return res.status(400).json({ msg: "Please enter a product name" });
  }
  if (!category) {
    return res.status(400).json({ msg: "Please enter the product category" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ msg: "Please enter the product description" });
  }
  if (!image_url) {
    return res.status(400).json({ msg: "Please select an image" });
  }
  if (!manufacturer) {
    return res
      .status(400)
      .json({ msg: "Please enter the name of the product manufacturer" });
  }

  const newProduct = new Product({
    product_name,
    category,
    description,
    image_url,
    manufacturer,
  });

  newProduct.save().then((product) => {
    if (product) return res.status(200).json({ product: product });
  });
};

exports.getAllProduct = (req, res) => {
  Product.find().then((product) => res.json({ product }));
};

exports.getSingleProduct =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    Product.findById(id)
      .then((product) => res.json({ product }))
      .catch((err) => console.log(err));
  });
