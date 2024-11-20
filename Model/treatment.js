const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreatmentSchema = new Schema({
    treatment: {
        type: String,
        required: true
    },
    specialitiesid:{
        type: Schema.Types.ObjectId,
        ref:'Specialities',
        required: true
    }
})

module.exports = mongoose.model('Treatment', TreatmentSchema)