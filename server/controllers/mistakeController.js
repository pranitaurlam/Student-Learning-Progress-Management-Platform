const Mistake = require('../models/Mistake');

exports.saveMistake = async (req, res) => {
    try {
        const { userId, questionId } = req.body;
        // Check if it already exists to avoid duplication
        const existing = await Mistake.findOne({ userId, questionId });
        if (existing) {
            return res.status(200).json({ message: 'Mistake already logged' });
        }
        const mistake = new Mistake(req.body);
        await mistake.save();
        res.status(201).json(mistake);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserMistakes = async (req, res) => {
    try {
        const mistakes = await Mistake.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(mistakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMistake = async (req, res) => {
    try {
        await Mistake.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Mistake removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMistakesByTopic = async (req, res) => {
    try {
        const mistakes = await Mistake.find({ topic: req.params.topic }).sort({ createdAt: -1 });
        res.status(200).json(mistakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
