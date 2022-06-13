const mqtt = require('mqtt');

const { MQTT_BROKER } = process.env;

module.exports = mqtt.connect(`mqtt://${MQTT_BROKER}`);
