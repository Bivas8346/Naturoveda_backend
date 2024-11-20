const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewSpecilitiesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // specialitiesid: {
  //   type: Schema.Types.ObjectId,
  //   ref: "NewDiseases",
  //   required: true,
  // },
  diseasesid: [
    {
      Sb_id: {
        type: Schema.Types.ObjectId,
        ref: "NewDiseases",
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("NewSpecilities", NewSpecilitiesSchema);
