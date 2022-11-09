const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experienceController");

router.post("/create", experienceController.addExperience);
router.get("/get", experienceController.getExperienceById);
router.get("/getUserExperience", experienceController.getExperienceByUserId);

module.exports = router;
