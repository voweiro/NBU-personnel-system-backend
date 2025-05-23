const db = require('../config/db');

// Get all unique ranks
const getAllRanks = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT "Rank" FROM "Staff" WHERE "Rank" IS NOT NULL ORDER BY "Rank"'
    );
    
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(row => row.Rank)
    });
  } catch (error) {
    console.error('Error fetching ranks:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching ranks'
    });
  }
};

module.exports = {
  getAllRanks
};
