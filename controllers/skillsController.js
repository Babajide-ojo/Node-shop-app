const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");

const Skill = require("../models/skills");

exports.addSkill = (req, res) => {
  let { userId, skills } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "This field can not be null" });
  }
  if (!skills) {
    return res.status(400).json({ msg: "Please enter a skill" });
  }

  const newSkill = new Skill({
    userId,
    skills,
  });

  newSkill.save().then((skill) => {
    if (skill)
      return res.status(200).json({ msg: "Skills successfully added", skill });
  });
};

exports.getAllJobs = (req, res) => {
  Skill.find({ sort: [["created_at", "descending"]] }).then((skill) =>
    res.json(skill)
  );
};

exports.getSkillById =
  ("/:id",
  (req, res) => {
    var userId = req.query.id;
    var query = { userId};
    Skill.find(query)
      .then((skill) => res.json(skill))
      .catch((err) => console.log(err));
  });


