import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FishSpecies = sequelize.define('FishSpecies', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  common_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  scientific_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  habitat: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  food_type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  feeding_frequency: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  care_tips: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  difficulty_level: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium',
  },
  min_temp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_temp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'fish_species',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['common_name'],
    },
  ],
});

export default FishSpecies;
