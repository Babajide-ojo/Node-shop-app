const express = require("express");
const Admin = require("../models/admin");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.resetPassword = (req, res) => {
  let { email } = req.body;
  let user_id = "";
  let admin = Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ msg: "Admin does not exists" });
      } else {
        user_id = admin.id;
        console.log("user_id",user_id);
      }
    })
    .catch((err) => console.log(err));
  // console.log(admin.schema.obj);

  
  let token =  Token.findOne({ userId: admin.id })
  if (token) {
      token.deleteOne();
  };
  let resetToken = crypto.randomBytes(32).toString("hex");

  const salt = bcrypt.genSaltSync(10);
  //const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  const hash = bcrypt.hashSync(resetToken, salt);
  console.log("hash",hash);

  const newToken = new Token({
      userId: user_id,
      token: hash,
      date: Date.now()
  });

  res.send(newToken);

  // newToken.save().then((newToken) => res.status(200).json({ newToken })).catch((err) => console.log(err));
};
