const mongoose = require('mongoose');

const mistakeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
}, { timestamps: true });

// Avoid duplicate entries for same question for the same user
mistakeSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Mistake', mistakeSchema);
