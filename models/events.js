const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    note: {
        type: String,
        required: false
    }
}, { timestamps: true });
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    location:{
        type:String
    },
    desc:{
        type:String
    },
    done: {
        type: Boolean,
        default: true
    },
    notes: [notesSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
