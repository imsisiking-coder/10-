import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Schedule from './Schedule.js';

const EmailLog = sequelize.define('EmailLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Schedule,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('sent', 'failed', 'bounced', 'opened', 'clicked'),
    defaultValue: 'sent',
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'email_logs',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['schedule_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['sent_at'],
    },
  ],
});

EmailLog.belongsTo(User, { foreignKey: 'user_id' });
EmailLog.belongsTo(Schedule, { foreignKey: 'schedule_id' });

export default EmailLog;
