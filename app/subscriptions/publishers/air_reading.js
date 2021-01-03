const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const { pubsub, topics } = require('..');

const serialPath = '/dev/serial/by-id/usb-Arduino_LLC_Arduino_Micro-if00';
const serialPort = new SerialPort(serialPath, { baudRate: 9600 });

const parser = new Readline();
serialPort.pipe(parser);

parser.on('data', (data) => {
  const pm25Value = parseInt(data, 10);

  if (!Number.isNaN(pm25Value)) {
    const payload = {
      pm25: pm25Value,
    };

    pubsub.publish(
      topics.AIR_READING_TOPIC,
      { airReading: payload },
    );
  }
});
