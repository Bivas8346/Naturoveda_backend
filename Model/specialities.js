const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecSchema = new Schema({
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Specialities', SpecSchema)