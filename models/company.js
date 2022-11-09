const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-type-email')

const CompanySchema = new Schema({
  name: {
    type: String,
  },
  sector: {
    type: String,
  },
  overview: {
    type: String,
  },
  staff_strength: {
    type: String,
  },
  profile_img: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now,
  }

})

module.exports = Company = mongoose.model('company', CompanySchema)
