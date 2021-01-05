const Query = {
  async tradfriDevices(root, variables, context) {
    const { tradfriClient } = context;

    return tradfriClient.getAllDevices();
  },
};

module.exports = { Query };
