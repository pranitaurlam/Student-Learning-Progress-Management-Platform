const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, default: 'Anonymous Student' },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeSpent: { type: Number, required: true }, // in seconds
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
