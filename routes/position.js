const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all position routes
router.use(authenticateToken);

// Position routes
router.get('/', positionController.getAllPositions);

module.exports = router;
