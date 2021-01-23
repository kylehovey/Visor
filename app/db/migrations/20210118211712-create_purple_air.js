module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    'purple_air_readings',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
    },
  ).then(() => queryInterface.createTable(
    'lakemont_pines_air_readings',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      purpleAirReadingId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'purple_air_readings',
          key: 'id',
        },
      },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      pm10: Sequelize.INTEGER,
      pm25: Sequelize.INTEGER,
      pm100: Sequelize.INTEGER,
    },
  )),

  down: async (queryInterface) => queryInterface
    .dropTable('lakemont_pines_air_readings')
    .then(() => queryInterface.dropTable('purple_air_readings')),
};
