const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const { pubsub, topics } = require('..');

if (process.env.NODE_ENV === 'production') {
  const serialPath = process.env.IAQ_SERIAL_PATH;
  const serialPort = new SerialPort(serialPath, { baudRate: 9600 });

  const parser = new Readline();
  serialPort.pipe(parser);

  try {
    parser.on('data', (data, ...rest) => {
      const payload = JSON.parse(data);
      pubsub.publish(
        topics.INDOOR_AIR_QUALITY_TOPIC,
        {
          indoorAirQuality: {
            ...payload,
            gasResistance: payload.gasResistance/1000,
            createdAt: Date.now(),
          },
        },
      );
    });
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.log(err);
  }
} else {
  setInterval(() => {
    const mockValue = Number.parseInt(
      Math.sin(+(new Date()) / 5000) * 50 + 50,
      10,
    );

    pubsub.publish(
      topics.INDOOR_AIR_QUALITY_TOPIC,
      {
        indoorAirQuality: {
          createdAt: Date.now(),
          rawTemperature: 24.0 + mockValue / 100,
          pressure: 1 + mockValue / 100,
          rawHumidity: mockValue,
          gasResistance: mockValue,
          iaq: mockValue,
          iaqAccuracy: 3,
          temperature: mockValue,
          humidity: mockValue,
          staticIaq: mockValue,
          CO2: 400 + mockValue,
          breathVOC: mockValue / 100,
        },
      },
    );
  }, 1000);
}
