const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const JobSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },
  company_name: {
    type: String,
  },
  title: {
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
  date: {
    type: String,
    default: moment().format("MMM Do YYYY"),
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Job = mongoose.model("job", JobSchema);