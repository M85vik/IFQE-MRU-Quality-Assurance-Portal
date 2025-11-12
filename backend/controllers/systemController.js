/**
 * @fileoverview Provides system-level metrics for developer monitoring.
 */

const os = require('os');

exports.getSystemHealth = async (req, res) => {
  try {
    // CPU Load Average (last 1 min)
    const cpuLoad = (os.loadavg()[0] / os.cpus().length) * 100;

    // Memory usage %
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsed = ((totalMem - freeMem) / totalMem) * 100;

    // Uptime in hours
    const uptimeHours = Math.floor(os.uptime() / 3600);

    res.json({
      cpu: +cpuLoad.toFixed(2),
      mem: +memUsed.toFixed(2),
      uptime: uptimeHours
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ message: 'Failed to get system health' });
  }
};
