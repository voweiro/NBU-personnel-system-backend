const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isSuperAdmin } = require('../middleware/auth');

// Login route
router.post('/login', authController.login);

// User management routes (protected and restricted to superadmin)
router.get('/users', authenticateToken, isSuperAdmin, authController.getUsers);
router.post('/users', authenticateToken, isSuperAdmin, authController.createUser);
router.put('/users/:id', authenticateToken, isSuperAdmin, authController.updateUser);
router.put('/users/:id/password', authenticateToken, isSuperAdmin, authController.changePassword);
router.delete('/users/:id', authenticateToken, isSuperAdmin, authController.deleteUser);

module.exports = router;
