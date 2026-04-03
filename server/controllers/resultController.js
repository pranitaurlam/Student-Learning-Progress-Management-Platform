const Result = require('../models/Result');

exports.saveResult = async (req, res) => {
    try {
        const result = new Result(req.body);
        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        // Simple ranking: sort by marks (desc) and then accuracy (desc)
        const topResults = await Result.find()
            .sort({ marks: -1, accuracy: -1 })
            .limit(10);
        res.status(200).json(topResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserRank = async (req, res) => {
    try {
        const { userId } = req.params;
        const userBest = await Result.findOne({ userId }).sort({ marks: -1, accuracy: -1 });

        if (!userBest) {
            return res.status(200).json({ rank: 'Not Ranked', total: await Result.countDocuments() });
        }

        const rank = await Result.countDocuments({
            $or: [
                { marks: { $gt: userBest.marks } },
                { marks: userBest.marks, accuracy: { $gt: userBest.accuracy } }
            ]
        }) + 1;

        const total = await Result.countDocuments();
        res.status(200).json({ rank, total, userBest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
