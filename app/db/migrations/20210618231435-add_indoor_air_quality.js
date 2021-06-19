module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    'indoorAirQuality',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
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
    },
  ),

  down: async (queryInterface) => queryInterface.dropTable('indoorAirQuality'),
};
