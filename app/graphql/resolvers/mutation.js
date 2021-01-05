const Mutation = {
  async setTradfriStatus(root, { id, type, status }, context) {
    const { tradfriClient } = context;

    try {
      if (type === 'bulb') {
        await tradfriClient.setBulbStatus(id, status);
      } else if (type === 'plug') {
        await tradfriClient.setPlugStatus(id, status);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  },
};

module.exports = { Mutation };
