const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const { pubsub, topics } = require('..');

if (process.env.NODE_ENV === 'production') {
  const serialPath = '/dev/serial/by-id/usb-Arduino_LLC_Arduino_Micro-if00';
  const serialPort = new SerialPort(serialPath, { baudRate: 9600 });

  const parser = new Readline();
  serialPort.pipe(parser);

  try {
    parser.on('data', (data) => {
      pubsub.publish(
        topics.AIR_READING_TOPIC,
        { airReading: JSON.parse(data) },
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
      topics.AIR_READING_TOPIC,
      {
        airReading: {
          pm10: Math.round(mockValue / 10),
          pm25: Math.round(mockValue / 2),
          pm100: mockValue,
          createdAt: Date.now(),
        },
      },
    );
  }, 1000);
}
