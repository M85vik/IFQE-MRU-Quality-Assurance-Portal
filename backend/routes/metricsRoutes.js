const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDeveloperSummary, getDeveloperCharts } = require('../controllers/metricsController');

// Developer-only access
router.get('/developer-summary', protect, authorize('developer'), getDeveloperSummary);
router.get('/charts', protect, authorize('developer'), getDeveloperCharts);

module.exports = router;
