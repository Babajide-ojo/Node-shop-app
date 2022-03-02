const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authCustomer')

const Customer = require('../models/customer')

exports.createCustomer = (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body

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

  //check for existing customer
  Customer.findOne({ email }).then((customer) => {
    if (customer)
      return res.status(400).json({ msg: 'customer already exists' })

    const newCustomer = new Customer({
      first_name,
      last_name,
      phone_number,
      email,
      password,
    })

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newCustomer.password, salt, (err, hash) => {
        if (err) throw err
        newCustomer.password = hash
        newCustomer.save().then((customer) => {
          jwt.sign(
            { id: customer.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err

              res.json({
                token: token,
                customer: {
                  id: customer.id,
                  name: customer.name,
                  email: customer.email,
                },
              })
            },
          )
        })
      })
    })
  })
};

