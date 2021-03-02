module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    'gas_readings',
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
      carbonDioxide: Sequelize.FLOAT,
      temperature: Sequelize.FLOAT,
      relativeHumidity: Sequelize.FLOAT,
    },
  ),

  down: async (queryInterface) => queryInterface.dropTable('gas_readings'),
};
