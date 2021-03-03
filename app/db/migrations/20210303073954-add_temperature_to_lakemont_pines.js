module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'lakemontPinesAirReadings',
      'temperature',
      { type: Sequelize.INTEGER },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('lakemontPinesAirReadings', 'temperature');
  },
};
