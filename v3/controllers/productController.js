const Product = require("../../v3/models/product");
//const logger = require("./../logger");

exports.addProduct = (req, res) => {
  let { name, category, size, description, manufacturer, price } = req.body;

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
  if (!price) {
    return res.status(400).json({ msg: "Please enter a product price" });
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

  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
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
    price,
    product_id: code,
  });
  console.log("product", newProduct);
  newProduct.save().then((product) => {
    if (product) {
      console.log(`Product added successfully ${product}`);
      return res.status(200).json(product);
    }
  });
};

exports.getProducts = (req, res) => {
  Product.find()
    .sort({ date: -1 })
    .then((product) => res.json(product));
};

exports.getProduct =
  ("/:id",
  (req, res) => {
    let id = req.query.id;
    Product.findById(id)
      .then((product) => res.json({ product }))
      .catch((err) => console.log(err));
  });

exports.editProduct =
  ("/:id",
  (req, res) => {
    try {
      var id = req.query.id;
      let { name, category, size, description, manufacturer, price } = req.body;
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
        return res
          .status(400)
          .json({ msg: "Please enter a product description" });
      }
      if (!price) {
        return res.status(400).json({ msg: "Please enter a product price" });
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

      let data = {
        name: req.body.name,
        category: req.body.category,
        size: req.body.size,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        price: req.body.price,
        image_url,
        image_url_one,
        image_url_two,
        manufacturer: req.body.manufacturer,
      };
      Product.findByIdAndUpdate(id, data)
        .then((product) => {
          res.json({ product }), console.log(product);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  });

exports.testProduct = (req, res) => {
  const data = [
    {
      id: 1,
      name: "Vitamin C Supplements",
      description: "Provides immune support and promotes healthy skin and bones.",
      price: 15.99,
      quantity: 50
    },
    {
      id: 2,
      name: "Omega-3 Fish Oil",
      description: "Supports heart health and brain function.",
      price: 25.49,
      quantity: 90
    },
    {
      id: 3,
      name: "Probiotic Supplements",
      description: "Helps maintain a healthy gut and immune system.",
      price: 12.99,
      quantity: 30
    },
    {
      id: 4,
      name: "Collagen Peptides Powder",
      description: "Promotes healthy skin, hair, and nails.",
      price: 29.99,
      quantity: 20
    },
    {
      id: 5,
      name: "Multivitamin Supplements",
      description: "Provides essential nutrients for overall health and well-being.",
      price: 18.99,
      quantity: 60
    },
    {
      id: 6,
      name: "Protein Bars",
      description: "Convenient and nutritious snacks for on-the-go.",
      price: 2.49,
      quantity: 24
    },
    {
      id: 7,
      name: "Green Tea Extract",
      description: "Helps promote weight loss and improve brain function.",
      price: 9.99,
      quantity: 120
    },
    {
      id: 8,
      name: "Magnesium Supplements",
      description: "Helps regulate muscle and nerve function, and maintain bone health.",
      price: 14.99,
      quantity: 90
    },
    {
      id: 9,
      name: "Ginger Supplements",
      description: "Helps relieve nausea and reduce inflammation.",
      price: 7.99,
      quantity: 60
    },
    {
      id: 10,
      name: "Turmeric Supplements",
      description: "Helps reduce inflammation and joint pain.",
      price: 11.99,
      quantity: 30
    }
  ]
  

  return res.json({ data });
};
