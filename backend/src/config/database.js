import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const useSQLiteFallback =
  process.env.DB_DIALECT === 'sqlite' ||
  (!process.env.DB_HOST && !process.env.DB_USER && !process.env.DB_PASSWORD) ||
  (process.env.DB_HOST === 'localhost' && process.env.DB_DIALECT !== 'postgres');

const sequelize = useSQLiteFallback
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_PATH || './fishcare_dev.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize(
      process.env.DB_NAME || 'fishcare_dev',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );

export default sequelize;
