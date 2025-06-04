const bcrypt = require('bcryptjs');
const db = require('../config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function createSuperAdmin() {
  try {
    // Check if superadmin already exists
    const adminCheck = await db.query(
      'SELECT * FROM "personnel_users" WHERE "role" = $1',
      ['superadmin']
    );

    if (adminCheck.rows.length > 0) {
      console.log('Superadmin user already exists.');
      process.exit(0);
    }

    // Superadmin credentials - in a production environment, move these to environment variables
    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'SuperAdminPass123!';
    const fullName = 'Super Administrator';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert superadmin into the database
    const newAdmin = await db.query(
      'INSERT INTO "personnel_users" ("email", "password", "full_name", "role") VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, fullName, 'superadmin']
    );

    if (newAdmin.rows.length === 0) {
      console.error('Failed to create superadmin user');
      process.exit(1);
    }

    console.log('Superadmin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the default password after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
}

createSuperAdmin();
