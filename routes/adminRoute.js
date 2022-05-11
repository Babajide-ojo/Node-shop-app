const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')
const parser = require('../config/upload');
const bcrypt = require('bcryptjs')
//const date = multer();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authAdmin')


router.post('/create', parser.single('image'), adminController.createAdmin);
router.get('/getAllAdmin', adminController.getAllAdmin)
router.get('/confirm/:confirmationCode', adminController.verifyUser)


module.exports = router;