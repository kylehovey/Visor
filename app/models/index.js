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
  temperature: Sequelize.FLOAT,
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

const IndoorAirQuality = connector.define('indoorAirQuality', {
  id,
  ...timestamps,
  rawTemperature: Sequelize.FLOAT,
  pressure: Sequelize.FLOAT,
  rawHumidity: Sequelize.FLOAT,
  gasResistance: Sequelize.FLOAT,
  iaq: Sequelize.FLOAT,
  iaqAccuracy: Sequelize.FLOAT,
  temperature: Sequelize.FLOAT,
  humidity: Sequelize.FLOAT,
  staticIaq: Sequelize.FLOAT,
  CO2: Sequelize.FLOAT,
  breathVOC: Sequelize.FLOAT,
}, {
  tableName: 'indoorAirQuality',
});

PurpleAirReading.LakemontPinesAirReading = PurpleAirReading.hasOne(LakemontPinesAirReading);
LakemontPinesAirReading.PurpleAirReading = LakemontPinesAirReading.belongsTo(PurpleAirReading);

module.exports = {
  AirReading,
  PurpleAirReading,
  LakemontPinesAirReading,
  GasReading,
  IndoorAirQuality,
};
