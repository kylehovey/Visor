const {
  TradfriClient,
  discoverGateway
} = require("node-tradfri-client");

const address = process.env.TRADFRI_IP;
const identity = process.env.TRADFRI_IDENTITY;
const psk = process.env.TRADFRI_PSK;

/**
 * The node-tradfri-client API doesn't have
 * a way to do a lot of the things I needed,
 * so this is built on top of that API
 */
class Client extends TradfriClient {
  static async discoverAndBuild() {
    const gatewayAddress = address === undefined
      ? (
        ({ name, addresses: [address] }) => address
      )(await discoverGateway())
      : address;

    const tradfri = new Client(gatewayAddress);
    await tradfri.connect(identity, psk);

    return tradfri;
  }

  async getAllDeviceIds() {
    const { payload: deviceIds } = await this.request(
      '/15001',
      'get',
      {},
    );

    return deviceIds;
  }

  async getStatusOf(deviceId) {
    const { payload: status } = await this.request(
      `/15001/${deviceId}`,
      'get',
      {},
    );

    return status;
  }

  async setBulbStatus(bulbId, status) {
    return this.request(
      `/15001/${bulbId}`,
      'put',
      { 3311: [{ 5851: status }] },
    );
  }

  async setPlugStatus(plugId, status) {
    return this.request(
      `/15001/${plugId}`,
      'put',
      { 3312: [{ 5850: status }] },
    );
  }

  async getAllDevices() {
    const deviceIds = await this.getAllDeviceIds();

    const devices = await Promise.all(
      deviceIds.map(async (id) => {
        const {
          9001: name,
          3: {
            1: info,
          },
          3311: bulbStatus,
          3312: plugStatus,
        } = await this.getStatusOf(id);

        const type = (_info => {
          if (/bulb/.test(_info)) return 'bulb';
          if (/outlet/.test(_info)) return 'plug';

          throw new Error('Unexpected device encountered');
        })(info);

        const base = { id, name, info, type };

        if (type === 'bulb') {
          const [{ 5851: status }] = bulbStatus;

          return { ...base, status };
        } else if (type === 'plug') {
          const [{ 5850: status }] = plugStatus;

          return { ...base, status };
        } else {
          throw new Error('Unhandled device type');
        }
      })
    );

    const bulbs = devices.filter(({ type }) => type === 'bulb');
    const plugs = devices.filter(({ type }) => type === 'plug');

    return { plugs, bulbs };
  }
}

module.exports = Client;
