const db = require('../config/db');
const { logActivity } = require('./activityLogController');

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT s.*, f."Faculty" FROM "Staff" s LEFT JOIN "Faculty" f ON s."FacultyID" = f."FacultyID" ORDER BY s."FullName"'
    );
    
    await logActivity(req.user.id, 'VIEW_STAFF_LIST', 'Viewed staff list', req);
    
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching staff'
    });
  }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT s.*, f."Faculty" FROM "Staff" s LEFT JOIN "Faculty" f ON s."FacultyID" = f."FacultyID" WHERE s."StaffID" = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    await logActivity(
      req.user.id,
      'VIEW_STAFF_DETAILS',
      `Viewed details of staff member: ${result.rows[0].FullName} (${id})`,
      req
    );
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching staff'
    });
  }
};

// Create a new staff member
const createStaff = async (req, res) => {
  try {
    const {
      Rank,
      StaffID,
      FullName,
      Email,
      Category,
      FacultyID,
      Status,
      Nationality,
      StateOfOrigin,
      LGA,
      DateOfBirth,
      DateOfEmployment,
      Address,
      Phone,
      Position
    } = req.body;
    
    // Check if staff ID already exists
    const existingStaff = await db.query(
      'SELECT * FROM "Staff" WHERE "StaffID" = $1',
      [StaffID]
    );
    
    if (existingStaff.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Staff with this ID already exists'
      });
    }
    
    // Handle empty date fields - convert empty strings to null
    const parsedDateOfBirth = DateOfBirth && DateOfBirth.trim() !== '' ? DateOfBirth : null;
    const parsedDateOfEmployment = DateOfEmployment && DateOfEmployment.trim() !== '' ? DateOfEmployment : null;
    
    // Insert new staff
    const result = await db.query(
      'INSERT INTO "Staff" ("Rank", "StaffID", "FullName", "Email", "Category", "FacultyID", "Status", "Nationality", "StateOfOrigin", "LGA", "DateOfBirth", "DateOfEmployment", "Address", "Phone", "Position") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [Rank, StaffID, FullName, Email, Category, FacultyID, Status, Nationality, StateOfOrigin, LGA, parsedDateOfBirth, parsedDateOfEmployment, Address, Phone, Position]
    );

    await logActivity(
      req.user.id,
      'CREATE_STAFF',
      `Created new staff member: ${FullName} (${StaffID})`,
      req
    );
    
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating staff'
    });
  }
};

// Update a staff member
const updateStaff = async (req, res) => {
  try {
    // Get and decode the staff ID from the URL parameters
    const id = decodeURIComponent(req.params.id);
    
    console.log('Attempting to update staff with ID:', id);
    const {
      Rank,
      FullName,
      Email,
      Category,
      FacultyID,
      Status,
      Nationality,
      StateOfOrigin,
      LGA,
      DateOfBirth,
      DateOfEmployment,
      Address,
      Phone,
      Position
    } = req.body;
    
    // Check if staff exists
    const existingStaff = await db.query(
      'SELECT * FROM "Staff" WHERE "StaffID" = $1',
      [id]
    );
    
    if (existingStaff.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    
    // Handle empty date fields - convert empty strings to null
    const parsedDateOfBirth = DateOfBirth && DateOfBirth.trim() !== '' ? DateOfBirth : null;
    const parsedDateOfEmployment = DateOfEmployment && DateOfEmployment.trim() !== '' ? DateOfEmployment : null;
    
    // Update staff
    const result = await db.query(
      'UPDATE "Staff" SET "Rank" = $1, "FullName" = $2, "Email" = $3, "Category" = $4, "FacultyID" = $5, "Status" = $6, "Nationality" = $7, "StateOfOrigin" = $8, "LGA" = $9, "DateOfBirth" = $10, "DateOfEmployment" = $11, "Address" = $12, "Phone" = $13, "Position" = $14 WHERE "StaffID" = $15 RETURNING *',
      [Rank, FullName, Email, Category, FacultyID, Status, Nationality, StateOfOrigin, LGA, parsedDateOfBirth, parsedDateOfEmployment, Address, Phone, Position, id]
    );

    await logActivity(
      req.user.id,
      'UPDATE_STAFF',
      `Updated staff member: ${FullName} (${id})`,
      req
    );
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating staff'
    });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  try {
    // Get and decode the staff ID from the URL parameters
    const id = decodeURIComponent(req.params.id);
    
    console.log('Attempting to delete staff with ID:', id);
    
    // Check if staff exists
    const existingStaff = await db.query(
      'SELECT * FROM "Staff" WHERE "StaffID" = $1',
      [id]
    );
    
    if (existingStaff.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    const staffName = existingStaff.rows[0].FullName;
    
    // Delete staff
    await db.query(
      'DELETE FROM "Staff" WHERE "StaffID" = $1',
      [id]
    );

    await logActivity(
      req.user.id,
      'DELETE_STAFF',
      `Deleted staff member: ${staffName} (${id})`,
      req
    );
    
    return res.status(200).json({
      success: true,
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting staff'
    });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
};
