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
      name: "Product 1",
      description: "This is the first product",
      price: 9.99,
      quantity: 10,
    },
    {
      id: 2,
      name: "Product 2",
      description: "This is the second product",
      price: 19.99,
      quantity: 20,
    },
    {
      id: 3,
      name: "Product 3",
      description: "This is the third product",
      price: 29.99,
      quantity: 30,
    },
    {
      id: 4,
      name: "Product 4",
      description: "This is the fourth product",
      price: 39.99,
      quantity: 40,
    },
    {
      id: 5,
      name: "Product 5",
      description: "This is the fifth product",
      price: 49.99,
      quantity: 50,
    },
    {
      id: 6,
      name: "Product 6",
      description: "This is the sixth product",
      price: 59.99,
      quantity: 60,
    },
    {
      id: 7,
      name: "Product 7",
      description: "This is the seventh product",
      price: 69.99,
      quantity: 70,
    },
    {
      id: 8,
      name: "Product 8",
      description: "This is the eighth product",
      price: 79.99,
      quantity: 80,
    },
    {
      id: 9,
      name: "Product 9",
      description: "This is the ninth product",
      price: 89.99,
      quantity: 90,
    },
    {
      id: 10,
      name: "Product 10",
      description: "This is the tenth product",
      price: 99.99,
      quantity: 100,
    },
  ];

  return res.json({ data });
};
