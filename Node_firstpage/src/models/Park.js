const mongoose = require('mongoose');
const {Schema} = mongoose;

const NoteSchema = new Schema({
    name: {type: String, required: true},
    ubication: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Park', NoteSchema);