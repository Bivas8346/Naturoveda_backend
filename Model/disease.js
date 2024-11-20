const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diseaseSchema = new Schema({
  disease_title: {
    type: String,
    required: true,
  },
  disease_description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  treatmentid: {
    type: Schema.Types.ObjectId,
    ref: "Treatment",
    required: true,
  },
  specialitiesid: {
    type: Schema.Types.ObjectId,
    ref: "Specialities",
    required: true,
  },
});

module.exports = mongoose.model("Disease", diseaseSchema);
