const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const ActivityLog = require('../models/ActivityLog');

// GET /api/activity?year=2024-25
router.get('/', protect, authorize('admin', 'superuser'), async (req, res) => {
  const { year } = req.query;
  const filter = year ? { academicYear: year } : {};
  
  try {
   const logs = await ActivityLog.find(filter)
  .populate('user', 'name email role') 
  .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Could not retrieve activity logs' });
  }
});

module.exports = router;
