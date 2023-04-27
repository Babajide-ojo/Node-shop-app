const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");

const Job = require("../models/job");

exports.createJob = (req, res) => {
  let {
    userId,
    title,
    description,
    category,
    company_overview,
    image_url,
    type,
    sector,
    overview,
    staff_strength,
    expiryDate,
    company_name,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "Please enter a company Id" });
  }
  if (!title) {
    return res.status(400).json({ msg: "Please enter a job title" });
  }
  if (!category) {
    return res.status(400).json({ msg: "Please enter a job title" });
  }
  if (!description) {
    return res.status(400).json({ msg: "Please enter the job description" });
  }
  if (!image_url) {
    return res.status(400).json({ msg: "Please select an image" });
  }

  const newJob = new Job({
    userId,
    title,
    description,
    category,
    company_overview,
    image_url,
    type,
    sector,
    overview,
    staff_strength,
    expiryDate,
    company_name,
  });

  newJob.save().then((job) => {
    if (job) return res.status(200).json({ job });
  });
};

exports.getAllJobs = (req, res) => {
  Job.find({ sort: [["created_at", "descending"]] }).then((job) =>
    res.json(job)
  );
};

exports.getJobById =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    Job.findById(id)
      .then((job) => res.json({ job }))
      .catch((err) => console.log(err));
  });

exports.getJobByCategory =
  ("/:category",
  (req, res) => {
    var value = req.query.category;
    console.log(value);
    if (value == "null") {
      Job.find()
        .then((job) => res.json(job))
        .catch((err) => console.log(err));
    } else {
      var query = { category: value };
      Job.find(query)
        .then((job) => res.json(job))
        .catch((err) => console.log(err));
    }
  });
