const ApiMetric = require('../models/ApiMetric');

const apiMetricsMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const userId = req.user ? req.user._id : null;
    console.log("req : " , req);
    
    try {
      await ApiMetric.create({
        route: req.originalUrl || "unknown",
        method: req.method,
        statusCode: res.statusCode,
        userId,
        responseTimeMs: duration,
      });
    } catch (err) {
      console.error("Failed to record API metric:", err.message);
    }
  });

  next();
};

module.exports = apiMetricsMiddleware;
