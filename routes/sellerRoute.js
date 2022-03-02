const express = require('express')
const router = express.Router();
const sellerController = require('../controllers/sellerController')
const parser = require('../config/upload');
const bcrypt = require('bcryptjs')
//const date = multer();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authSeller')

const Seller = require('../models/Seller')

router.post('/create', parser.single('image'), (req, res) => {
    let { first_name, last_name, email, password, phone_number } = req.body
 //  const result 
    let image = req.file.path;
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
    if(!image) {
      return res.status(400).json({msg:'Please upload an image of yourself'})
    }
    if(image.size > 2000000) {
      return res.status(400).json({msg:'Please upload an image less than 2mb'})
    }
  

  
    //check for existing Seller
    Seller.findOne({ email }).then((seller) => {
      if (seller)
        return res.status(400).json({ msg: 'Seller already exists' })
  
      const newSeller = new Seller({
        first_name,
        last_name,
        phone_number,
        email,
        password,
        image,
      });
  
      //Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newSeller.password, salt, (err, hash) => {
          if (err) throw err
          newSeller.password = hash
          newSeller.save().then((seller) => {
            jwt.sign(
              { id: seller.id },
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err
  
                res.json({
                  token: token,
                  Seller: {
                    id: seller.id,
                    name: seller.name,
                    email: seller.email,
                    image: seller.image,
                  },
                })
              },
            )
          })
        })
      })
    })
  });



module.exports = router;