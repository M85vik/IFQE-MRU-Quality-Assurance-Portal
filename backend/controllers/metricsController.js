/**
 * @fileoverview Developer Metrics Controller
 * Provides summarized and chart-ready metrics for the Developer Dashboard.
 * Aggregates data from ApiMetric and S3Metric collections.
 */

const os = require("os");
const ApiMetric = require("../models/ApiMetric");
const S3Metric = require("../models/S3Metric");

/* -------------------------------------------------------------------------- */
/* 🕐 Utility to calculate system uptime (in hours)                            */
/* -------------------------------------------------------------------------- */
const getSystemUptime = () => Math.floor(os.uptime() / 3600);

/* -------------------------------------------------------------------------- */
/* 📊 GET /api/metrics/developer-summary                                       */
/*  → Returns high-level system & metric stats for the dashboard              */
/* -------------------------------------------------------------------------- */
exports.getDeveloperSummary = async (req, res) => {
  try {
    // --- API METRICS SUMMARY ---
    const apiMetrics = await ApiMetric.find({});
    const uniqueRoutes = new Set(apiMetrics.map((m) => m.route));
    const totalRoutes = uniqueRoutes.size;
    const totalRequests = apiMetrics.length;

    // --- S3 METRICS SUMMARY ---
    const s3Stats = await S3Metric.aggregate([
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 },
        },
      },
    ]);

    let uploads = 0,
      downloads = 0,
      deletes = 0;
    s3Stats.forEach((s) => {
      if (s._id === "PUT") uploads = s.count;
      if (s._id === "GET") downloads = s.count;
      if (s._id === "DELETE") deletes = s.count;
    });

    const totalS3Ops = uploads + downloads + deletes;

    // --- Final Summary Object ---
    const summary = {
      totalRoutes, // distinct route paths
      totalRequests, // total API calls logged
      totalS3Ops,
      uploads,
      downloads,
      deletes,
      uptime: getSystemUptime(),
    };

    res.json({ summary });
  } catch (error) {
    console.error("Error fetching developer summary:", error);
    res.status(500).json({ message: "Failed to fetch developer summary" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📈 GET /api/metrics/charts                                                 */
/*  → Returns chart data for API routes & S3 monthly activity                 */
/* -------------------------------------------------------------------------- */
exports.getDeveloperCharts = async (req, res) => {
  try {
    // --- API METRICS CHART ---
    // Group by route to get avg response time, total hits, and last updated time
    const apiChart = await ApiMetric.aggregate([
      {
        $group: {
          _id: "$route",
          avgTime: { $avg: "$responseTimeMs" },
          hits: { $sum: 1 },
          lastUpdated: { $max: "$updatedAt" },
        },
      },
      { $sort: { hits: -1 } },
    ]).then((results) =>
      results.map((r) => ({
        route: r._id,
        avgTime: Math.round(r.avgTime || 0),
        hits: r.hits,
        updatedAt: r.lastUpdated,
      }))
    );

    // --- S3 METRICS CHART (Monthly trends for PUT/GET/DELETE) ---
    const s3Metrics = await S3Metric.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            operation: "$operation",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthly = {};
    for (const m of s3Metrics) {
      const key = `${m._id.month}/${m._id.year}`;
      if (!monthly[key])
        monthly[key] = { month: key, uploads: 0, downloads: 0, deletes: 0 };
      if (m._id.operation === "PUT") monthly[key].uploads = m.count;
      if (m._id.operation === "GET") monthly[key].downloads = m.count;
      if (m._id.operation === "DELETE") monthly[key].deletes = m.count;
    }

    const s3Chart = Object.values(monthly).sort((a, b) => {
      const [ma, ya] = a.month.split("/").map(Number);
      const [mb, yb] = b.month.split("/").map(Number);
      return ya - yb || ma - mb;
    });

    res.json({ apiChart, s3Chart });
  } catch (error) {
    console.error("Error fetching developer chart data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch developer chart data" });
  }
};
