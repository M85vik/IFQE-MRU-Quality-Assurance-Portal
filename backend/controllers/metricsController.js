/**
 * @fileoverview Developer Metrics Controller
 */

const os = require("os");
const ApiMetric = require("../models/ApiMetric");
const S3Metric = require("../models/S3Metric");
const ArchiveLog = require('../models/ArchiveLog');
const getSystemUptime = () => Math.floor(os.uptime() / 3600);


/* -------------------------------------------------------------------------- */
/* 📊 GET /api/metrics/developer-summary                                       */
/* -------------------------------------------------------------------------- */
exports.getDeveloperSummary = async (req, res) => {
  try {
    // --- API SUMMARY ---
    const apiMetrics = await ApiMetric.find({});
    const uniqueRoutes = new Set(apiMetrics.map(m => m.route));
    const totalRoutes = uniqueRoutes.size;
    const totalRequests = apiMetrics.length;

    // --- S3 SUMMARY (total counts) ---
    const s3Summary = await S3Metric.aggregate([
      {
        $group: {
          _id: null,
          uploads: { $sum: { $cond: [{ $eq: ["$operation", "PUT"] }, 1, 0] }},
          downloads: { $sum: { $cond: [{ $eq: ["$operation", "GET"] }, 1, 0] }},
          deletes: { $sum: { $cond: [{ $eq: ["$operation", "DELETE"] }, 1, 0] }},
        }
      }
    ]);

    const { uploads = 0, downloads = 0, deletes = 0 } = s3Summary[0] || {};
    const totalS3Ops = uploads + downloads + deletes;

    res.json({
      summary: {
        totalRoutes,
        totalRequests,
        uploads,
        downloads,
        deletes,
        totalS3Ops,
        uptime: getSystemUptime()
      }
    });

  } catch (error) {
    console.error("Error fetching developer summary:", error);
    res.status(500).json({ message: "Failed to fetch developer summary" });
  }
};



/* -------------------------------------------------------------------------- */
/* 📈 GET /api/metrics/charts                                                 */
/* -------------------------------------------------------------------------- */
exports.getDeveloperCharts = async (req, res) => {
  try {
    // --- API Chart ---
    const apiChart = await ApiMetric.aggregate([
      {
        $group: {
          _id: "$route",
          avgTime: { $avg: "$responseTimeMs" },
          hits: { $sum: 1 },
          lastUpdated: { $max: "$updatedAt" },
        },
      },
      { $sort: { hits: -1 } }
    ]).then(results =>
      results.map(r => ({
        route: r._id,
        avgTime: Math.round(r.avgTime),
        hits: r.hits,
        updatedAt: r.lastUpdated
      }))
    );


    // --- S3 Monthly Chart ---
    const s3Raw = await S3Metric.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            operation: "$operation",
          },
          count: { $sum: 1 },
        },
      }
    ]);

    const monthly = {};

    s3Raw.forEach(m => {
      const key = `${m._id.month}/${m._id.year}`;
      if (!monthly[key]) {
        monthly[key] = { month: key, uploads: 0, downloads: 0, deletes: 0 };
      }

      if (m._id.operation === "PUT") monthly[key].uploads = m.count;
      if (m._id.operation === "GET") monthly[key].downloads = m.count;
      if (m._id.operation === "DELETE") monthly[key].deletes = m.count;
    });

    const s3Chart = Object.values(monthly).sort((a, b) => {
      const [ma, ya] = a.month.split("/").map(Number);
      const [mb, yb] = b.month.split("/").map(Number);
      return ya - yb || ma - mb;
    });

    res.json({ apiChart, s3Chart });

  } catch (error) {
    console.error("Error fetching developer chart data:", error);
    res.status(500).json({ message: "Failed to fetch developer chart data" });
  }
};


exports.getArchiveLogs = async (req, res) => {
    try {
        const logs = await ArchiveLog.find().sort({ createdAt: -1 }).limit(50);
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ message: "Error fetching archive logs", error: err.message });
    }
};
