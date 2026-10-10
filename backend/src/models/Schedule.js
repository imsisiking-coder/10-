import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Aquarium from './Aquarium.js';

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  aquarium_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Aquarium,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('feeding', 'water_change', 'cleaning'),
    allowNull: false,
  },
  time_of_day: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'daily, weekly, monthly, etc.',
  },
  last_completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  next_scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'schedules',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['aquarium_id'],
    },
    {
      fields: ['next_scheduled_at'],
    },
  ],
});

Schedule.belongsTo(Aquarium, { foreignKey: 'aquarium_id' });
Aquarium.hasMany(Schedule, { foreignKey: 'aquarium_id' });

export default Schedule;
