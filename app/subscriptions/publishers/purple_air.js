const https = require('https');

const { pubsub, topics } = require('..');

setInterval(() => {
  new Promise((resolve, reject) => {
    const req = https.get(
      'https://www.purpleair.com/json?show=30051',
      (res) => {
        let out = '';

        res.on('data', (d) => out += d);
        res.on('end', () => {
          resolve(JSON.parse(out))
        });
        res.on('error', reject);
      },
    );
  }).then(({
    results: [{
      pm1_0_atm,
      pm2_5_atm,
      pm10_0_atm,
    }],
  }) => {
    const pm10 = Math.round(parseFloat(pm1_0_atm));
    const pm25 = Math.round(parseFloat(pm2_5_atm));
    const pm100 = Math.round(parseFloat(pm10_0_atm));

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
