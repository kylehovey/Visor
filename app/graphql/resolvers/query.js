const { Op } = require("sequelize");

const Query = {
  tradfriDevices(root, variables, context) {
    const { tradfriClient } = context;

    return tradfriClient.getAllDevices();
  },
  airReading(root, variables, context) {
    const { models } = context;
    const { timeFrom, timeTo } = variables;

    return models.AirReading.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            timeFrom,
            timeTo,
          ],
        },
      },
    });
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
      include: models.PurpleAirReading.LakemontPinesAirReading,
    });

    return readings.map(({ lakemontPinesAirReading, ...rest }) => ({
      ...rest,
      lakemontPines: lakemontPinesAirReading,
    }));
  },
};

module.exports = { Query };
