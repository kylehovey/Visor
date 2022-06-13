const client = require('./client.js');
const sensors = require('./sensors.js');

Object.values(sensors).forEach(
  ({ discoveryTopic, config }) => {

    client.publish(
      discoveryTopic,
      JSON.stringify(config),
      { retain: true },
    );
  },
);

module.exports = {
  client,
  sensors,
};
