const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-type-email')

const TokenSchema = new Schema({
  
  
  
  date: {
    type: Date,
    default: Date.now,
  }
})

module.exports = Token = mongoose.model('token', TokenSchema)
