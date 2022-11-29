const Admin = require("../../v3/models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.addAdmin = (req, res) => {
  let { first_name, last_name, email, password } = req.body;

  if (!first_name) {
    return res.status(400).json({ msg: "Please enter your first name" });
  }
  if (!last_name) {
    return res.status(400).json({ msg: "Please enter your last name" });
  }
  if (!email) {
    return res.status(400).json({ msg: "Please enter your email" });
  }
  if (!password) {
    return res.status(400).json({ msg: "Please enter your password" });
  }

  Admin.findOne({ email }).then((admin) => {
    if (admin) return res.status(400).json({ msg: "Admin already exists" });
  });

  const newAdmin = new Admin({
    first_name,
    last_name,
    email,
    password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) throw err;
      newAdmin.password = hash;
      newAdmin.save().then((admin) => {
        jwt.sign(
          { id: admin.id },
          process.env.jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token: token,
              Admin: {
                admin,
              },
            });
          }
        );
      });
    });
  });
};
