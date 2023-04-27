const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const JobSchema = new Schema({
userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  company_name: {
    type: String,
  },
  company_overview: {
    type: String,
  },
  title: {
    type: String,
  },
  company_overview: {
    type: String,
  },
  image_url: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  type: {
    type: String,
  },
  sector: {
    type: String,
  },
  staff_strength: {
    type: String,
  },
  expiryDate: {
    type: String,
    default: moment().format("MMM Do YYYY"),
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Job = mongoose.model("job", JobSchema);