const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  position: [
    {
      role: {
        type: String,
      },
      description: {
        type: Array,
      },
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
    },
  ],

  type: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Product = mongoose.model("experience", ExperienceSchema);
