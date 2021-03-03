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
          temperature,
        },
      },
    } = data;

    models.PurpleAirReading.create({
      lakemontPinesAirReading: {
        pm10,
        pm25,
        pm100,
        temperature,
      },
    }, {
      include: [{
        association: models.PurpleAirReading.LakemontPinesAirReading,
      }],
    });
  }
})(pubsub.asyncIterator(topics.PURPLE_AIR_TOPIC));
