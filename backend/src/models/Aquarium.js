import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Aquarium = sequelize.define('Aquarium', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '갤런 단위',
  },
  type: {
    type: DataTypes.ENUM('freshwater', 'saltwater'),
    defaultValue: 'freshwater',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'aquariums',
  underscored: true,
  timestamps: true,
});

Aquarium.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Aquarium, { foreignKey: 'user_id' });

export default Aquarium;
