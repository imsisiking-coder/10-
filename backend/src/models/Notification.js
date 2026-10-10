import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Schedule from './Schedule.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Schedule,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'schedule_reminder, email_sent, error_alert, etc.',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['user_id'],
    },
  ],
});

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Schedule, { foreignKey: 'schedule_id' });

export default Notification;
