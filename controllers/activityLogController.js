const ActivityLog = require('../models/activityLog');
const User = require('../models/user');

// Log activity helper function
const logActivity = async (userId, action, details, req) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Get all activity logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['email', 'full_name', 'role']
      }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs'
    });
  }
};

module.exports = {
  logActivity,
  getActivityLogs
}; 