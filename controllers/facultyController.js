const db = require('../config/db');

// Get all faculties
const getAllFaculties = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM "Faculty" ORDER BY "Faculty"'
    );
    
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching faculties'
    });
  }
};

// Get a single faculty by ID
const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM "Faculty" WHERE "FacultyID" = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching faculty by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching faculty'
    });
  }
};

// Create a new faculty
const createFaculty = async (req, res) => {
  try {
    const { Faculty } = req.body;
    
    // Check if faculty already exists
    const existingFaculty = await db.query(
      'SELECT * FROM "Faculty" WHERE "Faculty" = $1',
      [Faculty]
    );
    
    if (existingFaculty.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this name already exists'
      });
    }
    
    // Insert new faculty
    const result = await db.query(
      'INSERT INTO "Faculty" ("Faculty") VALUES ($1) RETURNING *',
      [Faculty]
    );
    
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating faculty'
    });
  }
};

// Update a faculty
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { Faculty } = req.body;
    
    // Check if faculty exists
    const existingFaculty = await db.query(
      'SELECT * FROM "Faculty" WHERE "FacultyID" = $1',
      [id]
    );
    
    if (existingFaculty.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    // Update faculty
    const result = await db.query(
      'UPDATE "Faculty" SET "Faculty" = $1 WHERE "FacultyID" = $2 RETURNING *',
      [Faculty, id]
    );
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating faculty'
    });
  }
};

// Delete a faculty
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if faculty exists
    const existingFaculty = await db.query(
      'SELECT * FROM "Faculty" WHERE "FacultyID" = $1',
      [id]
    );
    
    if (existingFaculty.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    // Check if faculty is being used by any staff
    const staffUsingFaculty = await db.query(
      'SELECT COUNT(*) FROM "Staff" WHERE "FacultyID" = $1',
      [id]
    );
    
    if (parseInt(staffUsingFaculty.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete faculty as it is being used by staff members'
      });
    }
    
    // Delete faculty
    await db.query(
      'DELETE FROM "Faculty" WHERE "FacultyID" = $1',
      [id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting faculty'
    });
  }
};

module.exports = {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
};
