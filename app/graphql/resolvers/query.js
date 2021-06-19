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
  async indoorAirQuality(root, variables, context) {
    const { models } = context;
    const { timeFrom, timeTo } = variables;

    const readings = await models.IndoorAirQuality.findAll({
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
      ({ createdAt, ...rest }) => ({
        createdAt: +(new Date(createdAt)),
        ...rest,
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

    return readings
      /**
       * Sequelize didn't add a foriegn key constraint, and I didn't use a transaction
       * to create the air reading data, so I think that this resulted in many purpleAirReading's
       * not having a corresponding lakemontPinesAirReading. The query to delete the erroneous
       * data takes too long to execute on the database, so we are just hacking this in here.
       */
      .filter(({ lakemontPinesAirReading }) => lakemontPinesAirReading !== null)
      .map(
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
