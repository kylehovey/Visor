const models = require('../../models');
const { pubsub, topics } = require('..');
const { client, sensors } = require('../mqtt');

const window = Number.parseInt(
  process.env.PARTICULATE_AVERAGE_WINDOW,
  10,
);

const init = {
  pm10: 0,
  pm25: 0,
  pm100: 0,
};

let lastTime = null;
let average = init;
let samples = 0;

const stow = () => {
  const { pm10, pm25, pm100 } = average;

  models.AirReading.create({
    pm10: Math.round(pm10),
    pm25: Math.round(pm25),
    pm100: Math.round(pm100),
    createdAt: lastTime,
  });

  client.publish(sensors.pm25.stateTopic, JSON.stringify({ pm1: pm10, pm25, pm10: pm100 }));

  average = init;
  samples = 0;
};

(async (stream) => {
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const { airReading } of stream) {
    try {
      const {
        pm10,
        pm25,
        pm100,
        createdAt,
      } = airReading;
      const { pm10: a10, pm25: a25, pm100: a100 } = average;

      lastTime = createdAt;
      average = {
        pm10: (samples * a10 + pm10) / (samples + 1),
        pm25: (samples * a25 + pm25) / (samples + 1),
        pm100: (samples * a100 + pm100) / (samples + 1),
      };

      samples += 1;

      if (samples === window) stow();
    } catch (err) {
      console.log(err);
    }
  }
})(pubsub.asyncIterator(topics.AIR_READING_TOPIC));
