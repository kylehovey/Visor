module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    'air_readings',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      pm25: Sequelize.INTEGER,
    },
  ),

  down: async (queryInterface) => queryInterface.dropTable('air_readings'),
};
