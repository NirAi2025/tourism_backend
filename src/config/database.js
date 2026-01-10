import { Sequelize } from 'sequelize';
import config from './index.js';

const { Mysql } = config;

const sequelize = new Sequelize(
  Mysql.dbName,
  Mysql.user,
  Mysql.pwd,
  {
    host: Mysql.host,
    dialect: Mysql.dialect,
    // logging: Mysql.debug,
    timezone: '+05:30',
  }
);

export default sequelize;
