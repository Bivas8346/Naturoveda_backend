const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testimonialsSchema = new Schema({
  clients_name: {
    type: String,
    required: true,
  },
  clients_review: {
    type: String,
    required: true,
  },
  disease_title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  patient_id:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Testimonials", testimonialsSchema);
