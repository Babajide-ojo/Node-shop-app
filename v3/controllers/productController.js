const Product = require("../../v3/models/product");
//const logger = require("./../logger");

exports.addProduct = (req, res) => {
  let { name, category, size, description, manufacturer } = req.body;

  let image_url = req.files.image_url[0].path;
  let image_url_one = req.files.image_url_one[0].path;
  let image_url_two = req.files.image_url_two[0].path;


  if (!name) {
    return res.status(400).json({ msg: "Please enter a product name" });
  }
  if (!category) {
    return res.status(400).json({ msg: "Please enter a product category" });
  }
  if (!size) {
    return res.status(400).json({ msg: "Please enter a product size" });
  }
  if (!description) {
    return res.status(400).json({ msg: "Please enter a product description" });
  }
  if (!image_url) {
    return res
      .status(400)
      .json({ msg: "Please enter the product main image url" });
  }
  if (!image_url_one) {
    return res
      .status(400)
      .json({ msg: "Please enter the product main image url" });
  }
  if (!image_url_two) {
    return res
      .status(400)
      .json({ msg: "Please enter the product main image url" });
  }
  if (!manufacturer) {
    return res.status(400).json({ msg: "Please enter a manufacturer" });
  }

  const newProduct = new Product({
    name,
    category,
    size,
    description,
    image_url,
    image_url_one,
    image_url_two,
    manufacturer,
  });

  newProduct.save().then((product) => {
    if (product){
      console.log(`Product added successfully ${product}`)
      return res.status(200).json({ product: product });
    } 
  });
};
