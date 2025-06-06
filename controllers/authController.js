const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// User login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the user from the personnel_users table
    const result = await db.query(
      'SELECT * FROM "personnel_users" WHERE "email" = $1',
      [email]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'nbu_secret_key',
      { expiresIn: '1h' }
    );

    // Return user info and token
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
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
  const { email, password, full_name, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM "personnel_users" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.query(
      'INSERT INTO "personnel_users" (email, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
      [email, hashedPassword, full_name, role]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Server error while creating user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, full_name, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM "personnel_users" WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    const result = await db.query(
      'UPDATE "personnel_users" SET email = $1, full_name = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, full_name, role, created_at',
      [email, full_name, role, id]
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error while updating user' });
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
  const { id } = req.params;

  try {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM "personnel_users" WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to delete a superadmin
    if (existingUser.rows[0].role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin user' });
    }

    // Delete user
    await db.query(
      'DELETE FROM "personnel_users" WHERE id = $1',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error while deleting user' });
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
