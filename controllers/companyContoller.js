const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");

exports.createCompany = (req, res) => {
  let { name, sector, overview, staff_strength, email, password } = req.body;
  let profile_img = req.files.profile_img[0].path;

  if (!name) {
    return res.status(400).json({ msg: "Please enter a company name" });
  }
  if (!sector) {
    return res.status(400).json({ msg: "Please enter the sector" });
  }
  if (!overview) {
    return res.status(400).json({ msg: "Please enter the company overview" });
  }
  if (!profile_img) {
    return res.status(400).json({ msg: "Please select a video" });
  }
  if (!staff_strength) {
    return res.status(400).json({ msg: "Please enter the staff range" });
  }
  if (!email) {
    return res.status(400).json({ msg: "Please enter a valid email" });
  }
  if (!password) {
    return res.status(400).json({ msg: "Please enter a valid password" });
  }
  const newCompany = new Company({
    name,
    sector,
    overview,
    profile_img,
    staff_strength,
    email,
    password,
  });
  Company.findOne({ email }).then((company) => {
    if (company){
        return res.status(400).json({ msg: "company email already exists" });
    }
    return saveCompany();
  });

  const saveCompany = () => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newCompany.password, salt, (err, hash) => {
        if (err) throw err;
        newCompany.password = hash;
        newCompany.save().then((company) => {
          jwt.sign(
            { id: company.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token: token,
                msg: "Company Account created successfully",
                company: {
                  company,
                },
              });
            }
          );
        });
      });
    });
  };
};

exports.getAllCompanies = (req, res) => {
  Company.find()
    .then((company) => res.json(company))
    .catch((err) => console.log(err));
};

exports.getSingleCompany =
  ("/:id",
  (req, res) => {
    var id = req.query.id;
    console.log("id", id);
    Company.findById(id)
      .then((company) => res.json(company))
      .catch((err) => console.log(err));
  });
