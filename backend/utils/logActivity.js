const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, details, academicYear, ipAddress) => {
  try {
    await ActivityLog.create({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      action,
      details,
      academicYear,
      ipAddress
    });
  } catch (err) {
    console.error('Error logging activity:', err.message);
  }
};

module.exports = logActivity;
