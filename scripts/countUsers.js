const db = require('../config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function countUsers() {
  try {
    // Query to count total users
    const result = await db.query('SELECT COUNT(*) FROM "personnel_users"');
    
    const count = result.rows[0].count;
    console.log(`Total number of users in the database: ${count}`);
    
    // Also list all users' emails and roles for reference
    if (count > 0) {
      const usersResult = await db.query('SELECT "email", "role", "full_name" FROM "personnel_users"');
      console.log('User list:');
      usersResult.rows.forEach((user, index) => {
        console.log(`  ${index + 1}. Email: ${user.email}, Name: ${user.full_name}, Role: ${user.role}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error counting users:', error);
    process.exit(1);
  }
}

countUsers();
