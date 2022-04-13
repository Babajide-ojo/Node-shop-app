const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authadmin')
const Admin = require('../models/admin')

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
