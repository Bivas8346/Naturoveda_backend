const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _adminId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 86400000,
    },
  },
});

module.exports = mongoose.model("Token", TokenSchema);
