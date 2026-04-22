const express = require('express');
const router = express.Router();
const { getExhibitionStats, getAllStats } = require('../controllers/statisticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/exhibition/:exhibitionId', authenticate, getExhibitionStats);
router.get('/all', authenticate, requireAdmin, getAllStats);

module.exports = router;