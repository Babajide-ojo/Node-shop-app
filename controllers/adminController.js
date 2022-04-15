const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authAdmin')
const cloudinary = require('cloudinary').v2
const Admin = require('../models/admin')




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

    const newAdmin = new Admin({
      first_name,
      last_name,
      email,
      password
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
                  admin
                },
              })
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
