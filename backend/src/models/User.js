import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  profile_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      emailNotificationEnabled: true,
      dailySummaryEnabled: false,
      quietStartHour: 22,
      quietEndHour: 8,
    },
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

export default User;
