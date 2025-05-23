const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Create Faculty table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Faculty" (
        "FacultyID" SERIAL PRIMARY KEY,
        "Faculty" VARCHAR(255) NOT NULL
      )
    `);
    console.log('Faculty table created or already exists');

    // Create Staff table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Staff" (
        "Rank" VARCHAR(100) NOT NULL,
        "StaffID" VARCHAR(50) PRIMARY KEY,
        "FullName" VARCHAR(255) NOT NULL,
        "Email" VARCHAR(255),
        "Category" VARCHAR(100),
        "FacultyID" INTEGER REFERENCES "Faculty"("FacultyID"),
        "Status" VARCHAR(50),
        "Nationality" VARCHAR(100),
        "StateOfOrigin" VARCHAR(100),
        "LGA" VARCHAR(100),
        "DateOfBirth" DATE,
        "DateOfEmployment" DATE,
        "Address" TEXT,
        "Phone" VARCHAR(50),
        "Position" VARCHAR(100)
      )
    `);
    console.log('Staff table created or already exists');

    // Create Users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "UserID" SERIAL PRIMARY KEY,
        "Email" VARCHAR(255) UNIQUE NOT NULL,
        "Password" VARCHAR(255) NOT NULL,
        "Role" VARCHAR(50) NOT NULL,
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    // Check if admin user exists
    const adminCheck = await pool.query(`
      SELECT * FROM "Users" WHERE "Email" = 'admin@nbu.edu'
    `);

    // Insert admin user if not exists
    if (adminCheck.rows.length === 0) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await pool.query(`
        INSERT INTO "Users" ("Email", "Password", "Role")
        VALUES ('admin@nbu.edu', $1, 'admin')
      `, [hashedPassword]);
      console.log('Admin user created with email: admin@nbu.edu and password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Insert sample faculties if none exist
    const facultiesCheck = await pool.query(`SELECT COUNT(*) FROM "Faculty"`);
    if (parseInt(facultiesCheck.rows[0].count) === 0) {
      const faculties = [
        'Faculty of Engineering',
        'Faculty of Science',
        'Faculty of Arts',
        'Faculty of Business Administration',
        'Faculty of Law',
        'Faculty of Medicine'
      ];

      for (const faculty of faculties) {
        await pool.query(`INSERT INTO "Faculty" ("Faculty") VALUES ($1)`, [faculty]);
      }
      console.log('Sample faculties inserted');
    }

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
