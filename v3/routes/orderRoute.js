const express = require("express");
const router = express.Router();
const orderController = require("../../v3/controllers/orderController");
//const parser = require("../../config/upload");
router.post("/add", orderController.addOrder);

// router.get("/all", productContoller.getProducts)

module.exports = router;