const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    contest: { type: Object, required: true },
    sendAt: { type: Date, required: true },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    attempts: { type: Number, default: 0 },
    lastError: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);