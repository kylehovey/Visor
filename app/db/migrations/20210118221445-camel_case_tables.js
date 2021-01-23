module.exports = {
  up: (queryInterface) => queryInterface
    .renameTable(
      'air_readings',
      'airReadings',
    )
    .then(() => queryInterface.renameTable(
      'purple_air_readings',
      'purpleAirReadings',
    ))
    .then(() => queryInterface.renameTable(
      'lakemont_pines_air_readings',
      'lakemontPinesAirReadings',
    )),

  down: (queryInterface) => queryInterface
    .renameTable(
      'airReadings',
      'air_readings',
    )
    .then(() => queryInterface.renameTable(
      'purpleAirReadings',
      'purple_air_readings',
    ))
    .then(() => queryInterface.renameTable(
      'lakemontPinesAirReadings',
      'lakemont_pines_air_readings',
    )),
};
