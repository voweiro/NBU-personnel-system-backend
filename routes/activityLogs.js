const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get activity logs (superadmin only)
router.get('/', authenticateToken, authorizeRole(['superadmin']), getActivityLogs);

module.exports = router; 