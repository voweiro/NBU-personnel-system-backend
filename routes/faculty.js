const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all faculty routes
router.use(authenticateToken);

// Faculty routes
router.get('/', facultyController.getAllFaculties);
router.get('/:id', facultyController.getFacultyById);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router;
