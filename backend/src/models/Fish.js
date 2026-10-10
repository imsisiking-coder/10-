import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Aquarium from './Aquarium.js';
import FishSpecies from './FishSpecies.js';

const Fish = sequelize.define('Fish', {
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
  species_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FishSpecies,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '물고기 별명',
  },
  added_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'fish',
  underscored: true,
  timestamps: true,
});

Fish.belongsTo(Aquarium, { foreignKey: 'aquarium_id' });
Fish.belongsTo(FishSpecies, { foreignKey: 'species_id' });
Aquarium.hasMany(Fish, { foreignKey: 'aquarium_id' });

export default Fish;
