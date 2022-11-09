const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyContoller");
const parser = require("../config/upload");

router.post(
  "/create",
  parser.fields([{ name: "profile_img", maxCount: 1 }]),
  companyController.createCompany
);
router.get("/getAllCompanies", companyController.getAllCompanies);
router.get("/getSingleCompany", companyController.getSingleCompany);

module.exports = router;
