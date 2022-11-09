const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  skills: {
    type: Array,
  },
});

module.exports = Product = mongoose.model("skills", SkillsSchema);
