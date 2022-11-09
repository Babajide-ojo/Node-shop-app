const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  course: {
    type: String,
  },
  degree_type: {
    type: String,
  },
  grade: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: String,
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Product = mongoose.model("education", EducationSchema);
