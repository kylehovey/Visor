const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const { pubsub, topics } = require('..');

if (process.env.NODE_ENV === 'production') {
  const serialPath = process.env.GAS_READING_SERIAL_PATH;
  const serialPort = new SerialPort(serialPath, { baudRate: 9600 });

  const parser = new Readline();
  serialPort.pipe(parser);

  parser.on('data', (data) => {
    try {
      const packet = JSON.parse(data);

      if (packet.carbonDioxide === 0) {
        console.warn('Initial reading, discarding.');

        return;
      }

      pubsub.publish(
        topics.GAS_READING_TOPIC,
        {
          gasReading: {
            ...packet,
            createdAt: Date.now(),
          },
        },
      );
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.log(err);
    }
  });
} else {
  setInterval(() => {
    const mockValue = Number.parseInt(
      Math.sin(+(new Date()) / 5000) * 50 + 50,
      10,
    );

    pubsub.publish(
      topics.GAS_READING_TOPIC,
      {
        gasReading: {
          temperature: mockValue / 4,
          relativeHumidity: mockValue,
          carbonDioxide: 550 + mockValue,
          createdAt: Date.now(),
        },
      },
    );
  }, 2000);
}
