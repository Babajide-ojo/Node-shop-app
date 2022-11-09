const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillsController");
const auth = require('../middleware/authUser')

router.post("/create", skillController.addSkill);
router.get("/getUserSkill", skillController.getSkillById);

module.exports = router;
