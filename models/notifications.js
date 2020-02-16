const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    events: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true

    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
