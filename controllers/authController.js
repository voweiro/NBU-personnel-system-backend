const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');
const { logActivity } = require('./activityLogController');

// User login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    await logActivity(user.id, 'LOGIN', `User logged in successfully`, req);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, full_name, role, created_at FROM "personnel_users" ORDER BY created_at DESC'
    );
    
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      full_name
    });

    // Log user creation
    await logActivity(req.user.id, 'CREATE_USER', `Created new user: ${email} with role ${role}`, req);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, full_name } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ email, role, full_name });

    // Log user update
    await logActivity(req.user.id, 'UPDATE_USER', `Updated user ${id}: ${email}`, req);

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating user'
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM "personnel_users" WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await db.query(
      'UPDATE "personnel_users" SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Server error while changing password' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete superadmin user'
      });
    }

    await user.destroy();

    // Log user deletion
    await logActivity(req.user.id, 'DELETE_USER', `Deleted user ${id}`, req);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting user'
    });
  }
};

module.exports = {
  login,
  getUsers,
  createUser,
  updateUser,
  changePassword,
  deleteUser
};
