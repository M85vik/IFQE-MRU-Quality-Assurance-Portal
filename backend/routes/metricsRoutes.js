const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDeveloperSummary, getDeveloperCharts,getArchiveLogs} = require('../controllers/metricsController');

// Developer-only access
router.get('/developer-summary', protect, authorize('developer'), getDeveloperSummary);
router.get('/charts', protect, authorize('developer'), getDeveloperCharts);
router.get('/archive-logs', protect, authorize('developer'), getArchiveLogs)




module.exports = router;
