const Sequelize = require('sequelize');
const connector = require('./connector');

const AirReadings = connector.define('air_reading', {
  pm25: Sequelize.INTEGER,
});

module.exports = { AirReadings };
