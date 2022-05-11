const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const parser = require('../config/upload');
const bcrypt = require('bcryptjs')
//const date = multer();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authUser')


router.post('/create', parser.single('image'), userController.createUser);
router.get('/getAllUser', userController.getAllUser)
router.get('/confirm/:confirmationCode', userController.verifyUser)


module.exports = router;