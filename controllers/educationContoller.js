const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");

const Education = require("../models/education");

exports.addEducation = (req, res) => {
  let { userId, name, course, start_date, end_date, degree_type, grade } =
    req.body;

  if (!userId) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!name) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!course) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!start_date) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!end_date) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!degree_type) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!grade) {
    return res.status(400).json({ msg: "This field can not be null" });
  }

  const newEducation = new Education({
    userId,
    name,
    course,
    start_date,
    end_date,
    degree_type,
    grade,
  });

  newEducation.save().then((education) => {
    if (education)
      return res
        .status(200)
        .json({ msg: "Education successfully added", education });
  });
};

exports.getEducationById =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    Education.findById(id)
      .then((education) => res.json(education))
      .catch((err) => console.log(err));
  });

exports.getEducationByUserId =
  ("/:user",
  (req, res) => {
    var value = req.query.user;
    console.log(value);
    if (value == "null") {
      Education.find()
        .then((education) => res.json(education))
        .catch((err) => console.log(err));
    } else {
      var query = { userId: value };
      Education.find(query)
        .then((education) => res.json(education))
        .catch((err) => console.log(err));
    }
  });
