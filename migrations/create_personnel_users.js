const { pool } = require('../config/db');

async function createPersonnelUsersTable() {
  try {
    console.log('Creating personnel_users table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "personnel_users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "full_name" VARCHAR(255) NOT NULL,
        "role" VARCHAR(50) NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('personnel_users table created successfully');
  } catch (error) {
    console.error('Error creating personnel_users table:', error);
    throw error;
  } finally {
    pool.end();
  }
}

createPersonnelUsersTable();
