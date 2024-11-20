const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uniquenessSchema = new Schema({
  uniq_title: {
    type: String,
    required: true,
  },
  uniq_heading: {
    type: String,
    required: true,
  },
  uniq_description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  uniq_text:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Uniqueness", uniquenessSchema);
