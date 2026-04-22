const express = require('express');
const router = express.Router();
const { getAll, create, getByExhibition } = require('../controllers/contractController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAll);
router.get('/exhibition/:exhibitionId', authenticate, getByExhibition);
router.post('/', authenticate, create);

module.exports = router;