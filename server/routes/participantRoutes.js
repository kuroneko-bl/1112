const express = require('express');
const router = express.Router();
const { getAll, create, setAsLaureate, getByExhibition } = require('../controllers/participantController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, getAll);
router.get('/exhibition/:exhibitionId', authenticate, getByExhibition);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id/laureate', authenticate, requireAdmin, setAsLaureate);

module.exports = router;