module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'air_readings',
      'pm10',
      { type: Sequelize.INTEGER },
    );
    await queryInterface.addColumn(
      'air_readings',
      'pm100',
      { type: Sequelize.INTEGER },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('air_readings', 'pm10');
    await queryInterface.removeColumn('air_readings', 'pm100');
  },
};
