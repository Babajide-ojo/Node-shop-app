const express = require("express");
const router = express.Router();
const orderController = require("../../v3/controllers/orderController");

router.post("/add", orderController.addOrder);
router.get("/singleOrder" , orderController.getOrderByEmail)
router.get("/single" , orderController.getOrderById)

module.exports = router;