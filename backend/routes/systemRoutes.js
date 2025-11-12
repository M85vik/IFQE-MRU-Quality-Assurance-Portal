const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSystemHealth } = require('../controllers/systemController');

// Only developers can view system metrics
router.get('/health', protect, authorize('developer'), getSystemHealth);

module.exports = router;
