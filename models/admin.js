const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-type-email')

const AdminSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending',
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
})

module.exports = Admin = mongoose.model('admin', AdminSchema)
