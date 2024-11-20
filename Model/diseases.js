const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewdiseasesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  sub_title: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
  specialities: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  about_title: {
    type: String,
    required: true,
  },
  about_disease: {
    type: String,
    required: true,
  },
  risk_factor: {
    type: String,
    required: true,
  },
  disease_point1: {
    type: String,
    required: true,
  },
  disease_point2: {
    type: String,
    required: true,
  },
  disease_point3: {
    type: String,
    required: true,
  },
  disease_point4: {
    type: String,
    required: "",
  },
  disease_point5: {
    type: String,
    required: "",
  },
  disease_point6: {
    type: String,
    required: "",
  },
  disease_point7: {
    type: String,
    required: "",
  },
  disease_point8: {
    type: String,
    required: "",
  },
  disease_point9: {
    type: String,
    required: "",
  },
  disease_point10: {
    type: String,
    required: "",
  },
  disease_point11: {
    type: String,
    required: "",
  },
  disease_point12: {
    type: String,
    required: "",
  },
  symptoms_title: {
    type: String,
    required: true,
  },
  symptoms_1: {
    type: String,
    required: true,
  },
  symptoms_2: {
    type: String,
    required: true,
  },
  symptoms_3: {
    type: String,
    required: true,
  },
  symptoms_4: {
    type: String,
    required: true,
  },
  symptoms_5: {
    type: String,
    required: "",
  },
  symptoms_6: {
    type: String,
    required: "",
  },
  symptoms_7: {
    type: String,
    required: "",
  },
  symptoms_8: {
    type: String,
    required: "",
  },
  symptoms_9: {
    type: String,
    required: "",
  },
  symptoms_10: {
    type: String,
    required: "",
  },
  complication_title: {
    type: String,
    required: true,
  },
  complication_1: {
    type: String,
    required: true,
  },
  complication_2: {
    type: String,
    required: true,
  },
  complication_3: {
    type: String,
    required: true,
  },
  complication_4: {
    type: String,
    required: "",
  },
  complication_5: {
    type: String,
    required: "",
  },
  complication_6: {
    type: String,
    required: "",
  },
  complication_7: {
    type: String,
    required: "",
  },
  complication_8: {
    type: String,
    required: "",
  },
  complication_9: {
    type: String,
    required: "",
  },
  complication_10: {
    type: String,
    required: "",
  },
  healthy_title:{
    type:String,
    required:true,
  },
  healthy_tips1: {
    type: String,
    required: true,
  },
  healthy_tips2: {
    type: String,
    required: true,
  },
  healthy_tips3: {
    type: String,
    required: true,
  },
  healthy_tips4: {
    type: String,
    required: "",
  },
  healthy_tips5: {
    type: String,
    required: "",
  },
  healthy_tips6: {
    type: String,
    required: "",
  },
  healthy_tips7: {
    type: String,
    required: "",
  },
  sub_heading: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("NewDiseases", NewdiseasesSchema);
