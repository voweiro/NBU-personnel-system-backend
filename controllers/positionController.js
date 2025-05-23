const db = require('../config/db');

// Get all unique positions
const getAllPositions = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT "Position" FROM "Staff" WHERE "Position" IS NOT NULL ORDER BY "Position"'
    );
    
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(row => row.Position)
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching positions'
    });
  }
};

module.exports = {
  getAllPositions
};
