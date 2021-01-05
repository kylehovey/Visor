const {
  TradfriClient,
  discoverGateway
} = require("node-tradfri-client");

const identity = process.env.TRADFRI_IDENTITY;
const psk = process.env.TRADFRI_PSK;

/**
 * The node-tradfri-client API doesn't have
 * a way to do a lot of the things I needed,
 * so this is built on top of that API
 */
class Client extends TradfriClient {
  static async discoverAndBuild() {
    const {
      name,
      addresses: [address],
    } = await discoverGateway();

    const tradfri = new Client(address);
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

    const bulbs = devices
      .filter(({ type }) => type === 'bulb')
      .map(({ id, ...rest }) => ({
        id,
        getStatus: async () => {
          const {
           3311: [{ 5851: status }],
          } = await this.getStatusOf(id);

          return status;
        },
        setStatus: (value) => this.request(
          `/15001/${id}`,
          'put',
          { 3311: [{ 5851: value }] },
        ),
        ...rest,
      }));

    const plugs = devices
      .filter(({ type }) => type === 'plug')
      .map(({ id, ...rest }) => ({
        id,
        getStatus: async () => {
          const {
           3312: [{ 5850: status }],
          } = await this.getStatusOf(id);

          return status;
        },
        setStatus: (value) => this.request(
          `/15001/${id}`,
          'put',
          { 3312: [{ 5850: value }] },
        ),
        ...rest,
      }));

    return { plugs, bulbs };
  }
}

module.exports = Client;
