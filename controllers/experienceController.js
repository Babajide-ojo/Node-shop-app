const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");
const Experience = require("../models/experience");

exports.addExperience = (req, res) => {
  let { userId, name, type, position } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "User Id can not be null" });
  }
  if (!name) {
    return res.status(400).json({ msg: "Name can not be null" });
  }
  if (!position) {
    return res.status(400).json({ msg: "Position can not be null" });
  }

  const newExperience = new Experience({
    userId,
    name,
    position,
    type,
  });

  newExperience.save().then((experience) => {
    if (experience)
      return res
        .status(200)
        .json({ msg: "Experience successfully added", experience });
  });
};

exports.getExperienceById =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    Experience.findById(id)
      .then((experience) => res.json(experience))
      .catch((err) => console.log(err));
  });

exports.getExperienceByUserId =
  ("/:user",
  (req, res) => {
    var value = req.query.user;
    if (value == "null") {
      Experience.find()
        .then((experience) => res.json(experience))
        .catch((err) => console.log(err));
    } else {
      var query = { userId: value };
      Experience.find(query)
        .then((experience) => res.json(experience))
        .catch((err) => console.log(err));
    }
  });
