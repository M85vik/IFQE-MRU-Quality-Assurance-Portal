const express = require('express');
const router = express.Router();
const ApiMetric = require('../models/ApiMetric');
const S3Metric = require('../models/S3Metric');

router.get('/metrics-summary', async (req, res) => {
  try {
    // --- Aggregate API data ---
    const apiSummary = await ApiMetric.aggregate([
      {
        $group: {
          _id: "$route",
          avgResponseTime: { $avg: "$responseTimeMs" },
          totalCalls: { $sum: 1 },
          successRate: {
            $avg: {
              $cond: [{ $lt: ["$statusCode", 400] }, 1, 0]
            }
          }
        }
      },
      { $sort: { totalCalls: -1 } },
      { $limit: 10 }
    ]);

    // --- Aggregate S3 data ---
    const s3Summary = await S3Metric.aggregate([
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 }
        }
      }
    ]);

    // --- System summary ---
    const totalApiCalls = await ApiMetric.countDocuments();
    const avgResponseTime = await ApiMetric.aggregate([
      { $group: { _id: null, avg: { $avg: "$responseTimeMs" } } }
    ]);

    res.json({
      apiSummary,
      s3Summary,
      totals: {
        totalApiCalls,
        avgResponseTime: avgResponseTime[0]?.avg || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching metrics summary.' });
  }
});

module.exports = router;
