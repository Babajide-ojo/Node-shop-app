const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationContoller");

router.post("/create", educationController.addEducation);
router.get("/get", educationController.getEducationById);
router.get("/getUserEducation", educationController.getEducationByUserId);

module.exports = router;
