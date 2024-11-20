const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  blog_title: {
    type: String,
    required: true,
  },
  blog_heading: {
    type: String,
    required: true,
  },
  blog_description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Blog", blogSchema);
