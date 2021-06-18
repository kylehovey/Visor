const models = require('../../models');
const { pubsub, topics } = require('..');

const window = Number.parseInt(
  process.env.GAS_AVERAGE_WINDOW,
  10,
);

const init = {
  carbonDioxide: 0,
  temperature: 0,
  relativeHumidity: 0,
};

let lastTime = null;
let average = init;
let samples = 0;

const stow = () => {
  models.GasReading.create({
    ...average,
    createdAt: lastTime,
  });

  average = init;
  samples = 0;
};

(async (stream) => {
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const { gasReading } of stream) {
    try {
      const {
        carbonDioxide,
        temperature,
        relativeHumidity,
        createdAt,
      } = gasReading;
      const {
        carbonDioxide: aCD,
        temperature: aT,
        relativeHumidity: aRH,
      } = average;

      lastTime = createdAt;
      average = {
        carbonDioxide: (samples * aCD + carbonDioxide) / (samples + 1),
        temperature: (samples * aT + temperature) / (samples + 1),
        relativeHumidity: (samples * aRH + relativeHumidity) / (samples + 1),
      };

      samples += 1;

      if (samples === window) stow();
    } catch (err) {
      console.log(err);
    }
  }
})(pubsub.asyncIterator(topics.GAS_READING_TOPIC));
