const express = require('express')
const router = express.Router()
const parser = require('../config/upload')
const productController = require('../controllers/productController')
const auth = require('../middleware/authAdmin')

router.post(
  '/create',
  parser.fields([
    { name: 'image_url', maxCount: 1 },
  ]),
  productController.createProduct,
)

router.get('/all', productController.getAllProduct);

router.get('/single', productController.getSingleProduct);

module.exports = router