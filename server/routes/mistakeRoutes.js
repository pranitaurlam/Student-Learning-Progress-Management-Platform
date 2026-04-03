const express = require('express');
const router = express.Router();
const mistakeController = require('../controllers/mistakeController');

router.post('/', mistakeController.saveMistake);
router.get('/:userId', mistakeController.getUserMistakes);
router.delete('/:id', mistakeController.deleteMistake);
router.get('/topic/:topic', mistakeController.getMistakesByTopic);

module.exports = router;
