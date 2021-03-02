module.exports = {
  up: (queryInterface) => queryInterface
    .renameTable(
      'gas_readings',
      'gasReadings',
    ),

  down: (queryInterface) => queryInterface
    .renameTable(
      'gasReadings',
      'gas_readings',
    ),
};
