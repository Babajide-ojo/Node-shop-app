const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-type-email')

const vAdminSchema = new Schema({
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
  }
})

module.exports = vAdmin = mongoose.model('vadmin', vAdminSchema)
