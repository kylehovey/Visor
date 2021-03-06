const { Op } = require('sequelize');

const Query = {
  tradfriDevices(root, variables, context) {
    const { tradfriClient } = context;

    return tradfriClient.getAllDevices();
  },
  async airReading(root, variables, context) {
    const { models } = context;
    const { timeFrom, timeTo } = variables;

    const readings = await models.AirReading.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            timeFrom,
            timeTo,
          ],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    return readings.map(
      ({
        createdAt,
        pm10,
        pm25,
        pm100,
      }) => ({
        pm10,
        pm25,
        pm100,
        createdAt: +(new Date(createdAt)),
      }),
    );
  },
  async gasReading(root, variables, context) {
    const { models } = context;
    const { timeFrom, timeTo } = variables;

    const readings = await models.GasReading.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            timeFrom,
            timeTo,
          ],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    return readings.map(
      ({
        createdAt,
        carbonDioxide,
        temperature,
        relativeHumidity,
      }) => ({
        carbonDioxide,
        temperature,
        relativeHumidity,
        createdAt: +(new Date(createdAt)),
      }),
    );
  },
  async purpleAir(root, variables, context) {
    const { models } = context;
    const { timeFrom, timeTo } = variables;

    const readings = await models.PurpleAirReading.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            timeFrom,
            timeTo,
          ],
        },
      },
      order: [['createdAt', 'ASC']],
      include: models.PurpleAirReading.LakemontPinesAirReading,
    });

    return readings.map(
      ({
        lakemontPinesAirReading,
        createdAt,
      }) => ({
        lakemontPines: lakemontPinesAirReading,
        createdAt: (+new Date(createdAt)),
      }),
    );
  },
};

module.exports = { Query };
