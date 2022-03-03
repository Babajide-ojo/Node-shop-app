const express = require('express')
const router = express.Router();
const sellerController = require('../controllers/sellerController')
const parser = require('../config/upload');
const bcrypt = require('bcryptjs')
//const date = multer();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authSeller')

const Seller = require('../models/Seller')

router.post('/create', parser.single('image'), sellerController.createSeller);



module.exports = router;