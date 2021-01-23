const models = require('../../models');
const { pubsub, topics } = require('..');

(async (stream) => {
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const data of stream) {
    const {
      purpleAir: {
        lakemontPines: {
          pm10,
          pm25,
          pm100,
        },
      },
    } = data;

    models.PurpleAirReading.create({
      lakemontPinesAirReading: {
        pm10: Math.round(pm10),
        pm25: Math.round(pm25),
        pm100: Math.round(pm100),
      },
    }, {
      include: [{
        association: models.PurpleAirReading.LakemontPinesAirReading,
      }],
    });
  }
})(pubsub.asyncIterator(topics.PURPLE_AIR_TOPIC));
