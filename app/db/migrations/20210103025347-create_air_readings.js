module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    'air_readings',
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
      pm25: Sequelize.INTEGER,
    },
  ),

  down: async (queryInterface) => queryInterface.dropTable('air_readings'),
};
