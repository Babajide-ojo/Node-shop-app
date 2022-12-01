const Order = require("../../v3/models/order");
//const logger = require("./../logger");

exports.addOrder = (req, res) => {
  let {
   
    total_price,
    payment_method,
    delivery_address,
    phone_number,
    email,
    items,
    status
  } = req.body;


  if (!total_price) {
    return res.status(400).json({ msg: "Please enter the total price" });
  }
  if (!payment_method) {
    return res.status(400).json({ msg: "Please enter a payment method" });
  }
  if (!status) {
    return res.status(400).json({ msg: "Please enter a payment method" });
  }
  if (!delivery_address) {
    return res.status(400).json({ msg: "Please enter a delivery address" });
  }
  if (!phone_number) {
    return res.status(400).json({ msg: "Please enter a phone number" });
  }
  if (!email) {
    return res.status(400).json({ msg: "Please enter the email" });
  }
  if (!items) {
    return res.status(400).json({ msg: "Please enter the items" });
  }

  const characters = "0123456789";
  let code = "F";
  for (let i = 0; i < 9; i++) {
    code += characters[Math.floor(Math.random() * 5)];
  }
  const newOrder = new Order({
    order_number: code,
    total_price,
    payment_method,
    delivery_address,
    phone_number,
    email,
    items,
    status
  });
console.log(newOrder);
  newOrder.save().then((order) => {
    if (order) {
      console.log(`Order added successfully ${order}`);
      return res.status(200).json(order);
    }
  });
};

exports.getProducts = (req, res) => {
  Product.find().then((product) => res.json({ product }));
};

exports.getProduct =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    Product.findById(id)
      .then((product) => res.json({ product }))
      .catch((err) => console.log(err));
  });
