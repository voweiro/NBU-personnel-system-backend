const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres.mxqxcuerfkdpsnkcbbbr',
  host: process.env.DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'NBUtempdb100%',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
    done();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
