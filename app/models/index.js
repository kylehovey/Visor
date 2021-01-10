const Sequelize = require('sequelize');
const connector = require('./connector');

const AirReadings = connector.define('air_reading', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  pm10: Sequelize.INTEGER,
  pm25: Sequelize.INTEGER,
  pm100: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = { AirReadings };
