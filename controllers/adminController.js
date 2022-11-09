const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authAdmin')
const cloudinary = require('cloudinary').v2
const Admin = require('../models/admin')
//const nodemailer = require('nodemailer')
const nodemail = require('../config/nodemailer')

exports.createAdmin = (req, res) => {
  let { first_name, last_name, email, password } = req.body

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

  //check for existing admin
  Admin.findOne({ email }).then((admin) => {
    if (admin) return res.status(400).json({ msg: 'Admin already exists' })

    // if (admin.status != 'Active') {
    //   return res.status(401).send({
    //     message: 'Pending Account. Please Verify Your Email!',
    //   })
    // }
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 25; i++) {
      code += characters[Math.floor(Math.random() * characters.length)]
    }
    const newAdmin = new Admin({
      first_name,
      last_name,
      email,
      password,
      confirmationCode: code,
    })

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newAdmin.password, salt, (err, hash) => {
        if (err) throw err
        newAdmin.password = hash
        newAdmin.save().then((admin) => {
          jwt.sign(
            { id: admin.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err
              res.json({
                token: token,
                Admin: {
                  admin,
                },
              })
              nodemail.sendConfirmationEmail(
                admin.first_name,
                admin.email,
                admin.confirmationCode,
              )
            },
          )
        })
      })
    })
  })
}

exports.getAllAdmin = (req, res) => {
  Admin.find().then((items) => res.json({ items }))
}

exports.verifyUser = (req, res, next) => {
  console.log(req.params.confirmationCode);
  Admin.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((admin) => {
      if (!admin) {
        return res.status(404).send({ message: "User Not found." });
      }

      admin.status = "Active";
      console.log(admin)
      admin.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};