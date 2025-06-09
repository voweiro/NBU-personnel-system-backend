const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/20240318_create_activity_logs.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Run the migration
      await client.query(migrationSQL);

      // Commit the transaction
      await client.query('COMMIT');
      console.log('Migration completed successfully!');
    } catch (error) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
runMigration(); 