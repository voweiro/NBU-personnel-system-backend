const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all rank routes
router.use(authenticateToken);

// Rank routes
router.get('/', rankController.getAllRanks);

module.exports = router;
