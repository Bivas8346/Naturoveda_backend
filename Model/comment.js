const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Comment", commentSchema);
