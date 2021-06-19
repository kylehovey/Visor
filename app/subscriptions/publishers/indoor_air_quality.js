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
          pm10: Math.round(mockValue / 10),
          pm25: Math.round(mockValue / 2),
          pm100: mockValue,
        },
      },
    );
  }, 1000);
}
