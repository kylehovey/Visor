const Sequelize = require('sequelize');
const connector = require('./connector');

const id = {
  type: Sequelize.BIGINT,
  primaryKey: true,
  autoIncrement: true,
};

const timestamps = {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
};

const particulateMeasurements = {
  pm10: Sequelize.INTEGER,
  pm25: Sequelize.INTEGER,
  pm100: Sequelize.INTEGER,
};

const PurpleAirReading = connector.define('purpleAirReadings', {
  id,
  ...timestamps,
});

const LakemontPinesAirReading = connector.define('lakemontPinesAirReadings', {
  id,
  purpleAirReadingId: {
    type: Sequelize.BIGINT,
    references: {
      model: 'purpleAirReading',
      key: 'id',
    },
  },
  ...timestamps,
  ...particulateMeasurements,
});

const AirReading = connector.define('airReadings', {
  id,
  ...timestamps,
  ...particulateMeasurements,
});

const GasReading = connector.define('gasReadings', {
  id,
  ...timestamps,
  carbonDioxide: Sequelize.FLOAT,
  temperature: Sequelize.FLOAT,
  relativeHumidity: Sequelize.FLOAT,
});

PurpleAirReading.LakemontPinesAirReading = PurpleAirReading.hasOne(LakemontPinesAirReading);
LakemontPinesAirReading.PurpleAirReading = LakemontPinesAirReading.belongsTo(PurpleAirReading);

module.exports = {
  AirReading,
  PurpleAirReading,
  LakemontPinesAirReading,
  GasReading,
};
