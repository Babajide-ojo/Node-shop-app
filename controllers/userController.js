const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2
const User = require('../models/user');
const nodemail = require('../config/nodemailer')

exports.createUser = (req, res) => {
  let { first_name, last_name, email, password, confirm_password } = req.body

  //req body validation
  if (!first_name) {
    return res.status(400).json({ msg: 'Please enter your first name' })
  }
  if (!last_name) {
    return res.status(400).json({ msg: 'Please enter  your last name' })
  }
  if (!email) {
    return res.status(400).json({ msg: 'Please enter your email' })
  }
  if (!password) {
    return res.status(400).json({ msg: 'Please enter your password' })
  }
  if (!confirm_password) {
    return res.status(400).json({ msg: 'Please enter your password' })
  }

  if(password === confirm_password){
  User.findOne({ email }).then((user) => {
    if (user) return res.json({ msg: 'user already exists' })


    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += characters[Math.floor(Math.random() * 6)]
    }
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      confirmationCode: code,
    })

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err
              res.json({
                token: token,
                msg: "Account created successfully",
                user: {
                  user,
                },
              })
              nodemail.sendConfirmationEmail(
                user.first_name,
                user.email,
                user.confirmationCode,
              )
            },
          )
        })
      })
    })
  })
  } else {
    return res.status(400).json({ msg: 'Please match your password' })
  }

}

exports.getAllUser = (req, res) => {
  User.find().then((items) => res.json({ items }))
}

exports.verifyUser = (req, res, next) => {
  console.log(req.params.confirmationCode);
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};