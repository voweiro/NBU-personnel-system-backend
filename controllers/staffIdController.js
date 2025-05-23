const db = require('../config/db');

// Generate a staff ID based on rank
const generateStaffId = async (req, res) => {
  try {
    const { rank } = req.body;
    
    if (!rank) {
      return res.status(400).json({
        success: false,
        message: 'Rank is required to generate a staff ID'
      });
    }
    
    let prefix = '';
    
    // Determine the prefix based on rank
    if (rank.toLowerCase().includes('junior')) {
      prefix = 'NBU/R/P/JS.';
    } else if (rank.toLowerCase().includes('senior')) {
      prefix = 'NBU/R/P/SS.';
    } else {
      // Default prefix for other ranks
      prefix = 'NBU/R/P/';
    }
    
    // Find the last staff ID with the same prefix
    const result = await db.query(
      'SELECT "StaffID" FROM "Staff" WHERE "StaffID" LIKE $1 ORDER BY "StaffID" DESC LIMIT 1',
      [`${prefix}%`]
    );
    
    let nextNumber = 1;
    
    if (result.rows.length > 0) {
      const lastId = result.rows[0].StaffID;
      // Extract the numeric part
      const numericPart = lastId.substring(prefix.length);
      // Parse it as an integer and increment
      nextNumber = parseInt(numericPart, 10) + 1;
      
      // If parsing fails, start from 1
      if (isNaN(nextNumber)) {
        nextNumber = 1;
      }
    }
    
    // Format the number with leading zeros to ensure 4 digits
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    const newStaffId = `${prefix}${formattedNumber}`;
    
    return res.status(200).json({
      success: true,
      data: newStaffId
    });
  } catch (error) {
    console.error('Error generating staff ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating staff ID'
    });
  }
};

module.exports = {
  generateStaffId
};
