const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.post('/', resultController.saveResult);
router.get('/leaderboard', resultController.getLeaderboard);
router.get('/rank/:userId', resultController.getUserRank);

module.exports = router;
