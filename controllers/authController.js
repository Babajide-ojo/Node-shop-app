const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authAdmin');
const Admin = require('../models/admin');
const User = require('../models/user');
const Company = require('../models/company');

exports.loginAdmin = (req, res) => {
  let { email, password } = req.body

  if (!email) {
    return res.status(400).json({ msg: 'Please enter your email' })
  }
  if (!password) {
    return res.status(400).json({ msg: 'Please enter your password' })
  }
  Admin.findOne({ email }).then((admin) => {
    if (!admin) return res.status(401).json({ msg: 'admin does not exists' })

    // Validate password
    bcrypt.compare(password, admin.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({
          msg: 'Invalid credentials',
        })

      jwt.sign(
        { id: admin.id },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err

          res.json({
            token: token,
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
            },
          })
        },
      )
    })
  })
}

exports.loginUser = (req, res) => {
  let { email, password } = req.body

  if (!email) {
    return res.status(400).json({ msg: 'Please enter your email' })
  }
  if (!password) {
    return res.status(400).json({ msg: 'Please enter your password' })
  }
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(401).json({ msg: 'user does not exists' })

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({
          msg: 'Invalid credentials',
        })

      jwt.sign(
        { id: user.id },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err

          res.json({
            token: token,
            user,
            msg: "Logged in successfully",
          })
        },
      )
    })
  })
}

exports.loginCompany = (req, res) => {
  let { email, password } = req.body

  if (!email) {
    return res.status(400).json({ msg: 'Please enter your email' })
  }
  if (!password) {
    return res.status(400).json({ msg: 'Please enter your password' })
  }
  Company.findOne({ email }).then((company) => {
    if (!company) return res.status(404).json({msg: 'company profile not found'})

    // Validate password
    bcrypt.compare(password, company.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({
          msg: 'Invalid credentials(Password Incorrect)',
        })

      jwt.sign(
        { id: company.id },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err

          res.json({
            token: token,
            company: {
              id: company.id,
              name: company.name,
              email: company.email,
            },
          })
        },
      )
    })
  })
}