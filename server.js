const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const facultyRoutes = require('./routes/faculty');
const positionRoutes = require('./routes/position');
const rankRoutes = require('./routes/rank');
const staffIdRoutes = require('./routes/staffId');
const activityLogRoutes = require('./routes/activityLogs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS for cross-domain requests
app.use(cors({
  origin: ['https://nbu-personnel-system-frontend.vercel.app', 'http://localhost:3000'], // Allow requests from frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/rank', rankRoutes);
app.use('/api/staffId', staffIdRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Nigerian British University Personnel Management System API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
