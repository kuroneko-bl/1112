const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/exhibitionController');
const { authenticate, requireAuth, requireAdmin } = require('../middleware/auth');

// GET запросы - доступны всем (даже без авторизации)
router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);

// POST, PUT, DELETE - только для админов и требуют авторизацию
router.post('/', authenticate, requireAuth, requireAdmin, create);
router.put('/:id', authenticate, requireAuth, requireAdmin, update);
router.delete('/:id', authenticate, requireAuth, requireAdmin, remove);

module.exports = router;