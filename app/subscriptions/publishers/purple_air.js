const axios = require('axios');

const { pubsub, topics } = require('..');

const { PURPLE_AIR_DATA_URL } = process.env;

const purplePipeline = () => axios
  .get(PURPLE_AIR_DATA_URL)
  .then(({
    data: {
      results: [{
        pm1_0_atm: rawPm10,
        pm2_5_atm: rawPm25,
        pm10_0_atm: rawPm100,
        temp_f: temperatureFarenheit,
      }],
    },
  }) => [rawPm10, rawPm25, rawPm100, temperatureFarenheit])
  .then((data) => data.map((x) => Math.round(parseFloat(x))))
  .then(([pm10, pm25, pm100, temperatureFarenheit]) => pubsub.publish(
    topics.PURPLE_AIR_TOPIC,
    {
      purpleAir: {
        createdAt: Date.now(),
        lakemontPines: {
          pm10,
          pm25,
          pm100,
          temperature: Math.round((temperatureFarenheit - 32) * (5 / 9)),
          createdAt: Date.now(),
        },
      },
    },
  ));

const run = async () => {
  try {
    await purplePipeline();
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.log(err);
  }

  await new Promise((r) => setTimeout(r, 5e3));

  setTimeout(run, 0);
};

const mock = async () => {
  const mockValue = Number.parseInt(
    Math.sin(+(new Date()) / 5000) * 50 + 50,
    10,
  );

  pubsub.publish(
    topics.PURPLE_AIR_TOPIC,
    {
      purpleAir: {
        createdAt: Date.now(),
        lakemontPines: {
          createdAt: Date.now(),
          pm10: Math.round(mockValue / 10),
          pm25: Math.round(mockValue / 2),
          pm100: mockValue,
          temperature: Math.round(50 + mockValue / 2),
        },
      },
    },
  );

  await new Promise((r) => setTimeout(r, 5000));

  mock();
};

if (process.env.NODE_ENV === 'production') {
  run();
} else {
  mock();
}
