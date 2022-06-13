const discoveryTopicFor = (id, dClass) => `homeassistant/sensor/${id}/config`;
const stateTopicFor = (id) => `home/sensor/${id}/value`;

const livingRoomSmokeId = 'livingRoomSmoke';
const livingRoomStateTopic = stateTopicFor(livingRoomSmokeId);

const pm1DiscoveryTopic = discoveryTopicFor(`${livingRoomSmokeId}_pm1`)
const pm1Config = {
  name: 'Living Room PM1.0',
  stat_t: livingRoomStateTopic,
  unit_of_meas: 'µg/m³',
  dev_cla: 'pm1',
  frc_upd: true,
  val_tpl: '{{ value_json.pm1|default(0) }}',
};

const pm25DiscoveryTopic = discoveryTopicFor(`${livingRoomSmokeId}_pm25`)
const pm25Config = {
  name: 'Living Room PM2.5',
  stat_t: livingRoomStateTopic,
  unit_of_meas: 'µg/m³',
  dev_cla: 'pm25',
  frc_upd: true,
  val_tpl: '{{ value_json.pm25|default(0) }}',
};

const pm10DiscoveryTopic = discoveryTopicFor(`${livingRoomSmokeId}_pm10`)
const pm10Config = {
  name: 'Living Room PM10.0',
  stat_t: livingRoomStateTopic,
  unit_of_meas: 'µg/m³',
  dev_cla: 'pm10',
  frc_upd: true,
  val_tpl: '{{ value_json.pm10|default(0) }}',
};

const livingRoomCO2Id = 'livingRoomCO2';
const livingRoomCO2Topic = stateTopicFor(livingRoomCO2Id);

const co2DiscoveryTopic = discoveryTopicFor(`${livingRoomCO2Id}_co2`)
const co2Config = {
  name: 'Living Room CO2',
  stat_t: livingRoomCO2Topic,
  unit_of_meas: 'ppm',
  dev_cla: 'carbon_dioxide',
  frc_upd: true,
  val_tpl: '{{ value_json.co2|default(0) }}',
};

const temperatureDiscoveryTopic = discoveryTopicFor(`${livingRoomCO2Id}_temperature`)
const temperatureConfig = {
  name: 'Living Room Temperature',
  stat_t: livingRoomCO2Topic,
  unit_of_meas: '˚C',
  dev_cla: 'temperature',
  frc_upd: true,
  val_tpl: '{{ value_json.temperature|default(0) }}',
};

const humidityDiscoveryTopic = discoveryTopicFor(`${livingRoomCO2Id}_humidity`)
const humidityConfig = {
  name: 'Living Room Relative Humidity',
  stat_t: livingRoomCO2Topic,
  unit_of_meas: '%',
  dev_cla: 'humidity',
  frc_upd: true,
  val_tpl: '{{ value_json.humidity|default(0) }}',
};

const livingRoomVOCId = 'livingRoomVOC';
const livingRoomVOCTopic = stateTopicFor(livingRoomVOCId);

const vocDiscoveryTopic = discoveryTopicFor(`${livingRoomVOCId}_voc`)
const vocConfig = {
  name: 'Living Room VOC',
  stat_t: livingRoomVOCTopic,
  unit_of_meas: 'ppm',
  dev_cla: 'volatile_organic_compounds',
  frc_upd: true,
  val_tpl: '{{ value_json.voc|default(0) }}',
};

const iaqDiscoveryTopic = discoveryTopicFor(`${livingRoomVOCId}_iaq`)
const iaqConfig = {
  name: 'Living Room IAQ',
  stat_t: livingRoomVOCTopic,
  unit_of_meas: '',
  dev_cla: 'aqi',
  frc_upd: true,
  val_tpl: '{{ value_json.iaq|default(0) }}',
};

module.exports = {
  pm1: {
    stateTopic: livingRoomStateTopic,
    discoveryTopic: pm1DiscoveryTopic,
    config: pm1Config,
  },
  pm25: {
    stateTopic: livingRoomStateTopic,
    discoveryTopic: pm25DiscoveryTopic,
    config: pm25Config,
  },
  pm10: {
    stateTopic: livingRoomStateTopic,
    discoveryTopic: pm10DiscoveryTopic,
    config: pm10Config,
  },
  co2: {
    stateTopic: livingRoomCO2Topic,
    discoveryTopic: co2DiscoveryTopic,
    config: co2Config,
  },
  temperature: {
    stateTopic: livingRoomCO2Topic,
    discoveryTopic: temperatureDiscoveryTopic,
    config: temperatureConfig,
  },
  humidity: {
    stateTopic: livingRoomCO2Topic,
    discoveryTopic: humidityDiscoveryTopic,
    config: humidityConfig,
  },
  voc: {
    stateTopic: livingRoomVOCTopic,
    discoveryTopic: vocDiscoveryTopic,
    config: vocConfig,
  },
  iaq: {
    stateTopic: livingRoomVOCTopic,
    discoveryTopic: iaqDiscoveryTopic,
    config: iaqConfig,
  },
};
