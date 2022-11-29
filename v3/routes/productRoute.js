const express = require("express");
const router = express.Router();
const productContoller = require("../../v3/controllers/productController");
const parser = require("../../config/upload");
router.post(
  "/add",
  parser.fields([
    { name: "image_url", maxCount: 1 },
    { name: "image_url_one", maxCount: 1 },
    { name: "image_url_two", maxCount: 1 },
  ]),
  productContoller.addProduct
);

module.exports = router;
