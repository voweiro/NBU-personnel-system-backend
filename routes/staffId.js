const express = require('express');
const router = express.Router();
const staffIdController = require('../controllers/staffIdController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all staff ID routes
router.use(authenticateToken);

// Staff ID routes
router.post('/generate', staffIdController.generateStaffId);

module.exports = router;
