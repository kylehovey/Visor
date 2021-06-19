const models = require('../../models');
const { pubsub, topics } = require('..');

const window = Number.parseInt(
  process.env.IAQ_AVERAGE_WINDOW,
  10,
);

const nextAverage = (prevAvg, newValue, count) => (prevAvg * count + newValue) / (count + 1);

const init = {
  rawTemperature: 0,
  pressure: 0,
  rawHumidity: 0,
  gasResistance: 0,
  iaq: 0,
  iaqAccuracy: 0,
  temperature: 0,
  humidity: 0,
  staticIaq: 0,
  CO2: 0,
  breathVOC: 0,
};

let lastTime = null;
let average = init;
let samples = 0;

const stow = () => {
  models.IndoorAirQuality.create({
    ...average,
    createdAt: lastTime,
  });

  average = init;
  samples = 0;
};

(async (stream) => {
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const { indoorAirQuality } of stream) {
    try {
      const {
        rawTemperature,
        pressure,
        rawHumidity,
        gasResistance,
        iaq,
        iaqAccuracy,
        temperature,
        humidity,
        staticIaq,
        CO2,
        breathVOC,
        createdAt,
      } = indoorAirQuality;
      const {
        rawTemperature: aRT,
        pressure: aP,
        rawHumidity: aRH,
        gasResistance: aGR,
        iaq: aIAQ,
        iaqAccuracy: aIAQA,
        temperature: aT,
        humidity: aH,
        staticIaq: aSI,
        CO2: aCO2,
        breathVOC: aBVOC,
      } = average;

      lastTime = createdAt;
      average = {
        rawTemperature: nextAverage(rawTemperature, aRT, samples),
        pressure: nextAverage(pressure, aP, samples),
        rawHumidity: nextAverage(rawHumidity, aRH, samples),
        gasResistance: nextAverage(gasResistance, aGR, samples),
        iaq: nextAverage(iaq, aIAQ, samples),
        iaqAccuracy: nextAverage(iaqAccuracy, aIAQA, samples),
        temperature: nextAverage(temperature, aT, samples),
        humidity: nextAverage(humidity, aH, samples),
        staticIaq: nextAverage(staticIaq, aSI, samples),
        CO2: nextAverage(CO2, aCO2, samples),
        breathVOC: nextAverage(breathVOC, aBVOC, samples),
      };

      samples += 1;

      if (samples === window) stow();
    } catch (err) {
      console.log(err);
    }
  }
})(pubsub.asyncIterator(topics.INDOOR_AIR_QUALITY_TOPIC));
