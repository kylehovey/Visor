const axios = require('axios');

const { pubsub, topics } = require('..');

const run = () => axios
  .get('https://www.purpleair.com/json?show=30051')
  .then(({
    data: {
      results: [{
        pm1_0_atm: rawPm10,
        pm2_5_atm: rawPm25,
        pm10_0_atm: rawPm100,
      }],
    },
  }) => {
    const pm10 = Math.round(parseFloat(rawPm10));
    const pm25 = Math.round(parseFloat(rawPm25));
    const pm100 = Math.round(parseFloat(rawPm100));

    pubsub.publish(
      topics.PURPLE_AIR_TOPIC,
      {
        purpleAir: {
          lakemontPines: {
            pm10,
            pm25,
            pm100,
          },
        },
      },
    );
  })
  /* eslint-disable-next-line no-console */
  .catch(console.log)
  .then(() => new Promise((r) => setTimeout(r, 5000)))
  .then(run);

run();
