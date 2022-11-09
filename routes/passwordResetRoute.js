const express = require('express')
const router = express.Router();
const passwordResetController = require('../controllers/resetPasswordController')
const parser = require('../config/upload');
const bcrypt = require('bcryptjs')
//const date = multer();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authAdmin')


router.post('/reset', passwordResetController.resetPassword);



module.exports = router;