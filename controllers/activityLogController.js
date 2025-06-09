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

// Get all activity logs with pagination
const getActivityLogs = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const totalCount = await ActivityLog.count();

    // Get paginated logs
    const logs = await ActivityLog.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['email', 'full_name', 'role']
      }],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: logs,
      page: page,
      limit: limit,
      total: totalCount,
      totalPages: totalPages
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