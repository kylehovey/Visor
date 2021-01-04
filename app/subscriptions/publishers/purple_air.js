const https = require('https');

const { pubsub, topics } = require('..');

setInterval(() => {
  new Promise((resolve, reject) => {
    https.get(
      'https://www.purpleair.com/json?show=30051',
      (res) => {
        let out = '';

        res.on('data', (d) => {
          out += d;
        });
        res.on('end', () => {
          resolve(JSON.parse(out));
        });
        res.on('error', reject);
      },
    );
  }).then(({
    results: [{
      pm1_0_atm: rawPm10,
      pm2_5_atm: rawPm25,
      pm10_0_atm: rawPm100,
    }],
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
  });
}, 5e3);
