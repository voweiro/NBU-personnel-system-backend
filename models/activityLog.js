const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'personnel_users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'activity_logs',
  timestamps: true,
  underscored: true
});

// Define the association
ActivityLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = ActivityLog; 