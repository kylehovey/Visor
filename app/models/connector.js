const Sequelize = require('sequelize');

const connector = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: process.env.ENABLE_SQL_LOGGING === 'true',
  },
);

module.exports = connector;
