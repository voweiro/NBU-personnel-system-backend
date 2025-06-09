const express = require('express');
const router = express.Router();
const { getActivityLogs, logActivity } = require('../controllers/activityLogController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get activity logs (superadmin only)
router.get('/', authenticateToken, authorizeRole(['superadmin']), getActivityLogs);

// Create activity log (authenticated users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    const userId = req.user.id;

    await logActivity(userId, action, details, req);

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully'
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity log'
    });
  }
});

module.exports = router; 