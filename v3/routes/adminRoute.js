const express = require('express');
const router = express.Router();
const adminController = require('../../v3/controllers/adminController');

router.post('/add', adminController.addAdmin);

module.exports = router;