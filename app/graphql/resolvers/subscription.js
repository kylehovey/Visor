const Subscription = {
  purpleAir: {
    subscribe: (root, variables, context) => {
      const { pubsub, topics } = context;

      return pubsub.asyncIterator([topics.PURPLE_AIR_TOPIC]);
    },
  },
  airReading: {
    subscribe: (root, variables, context) => {
      const { pubsub, topics } = context;

      return pubsub.asyncIterator([topics.AIR_READING_TOPIC]);
    },
  },
  gasReading: {
    subscribe: (root, variables, context) => {
      const { pubsub, topics } = context;

      return pubsub.asyncIterator([topics.GAS_READING_TOPIC]);
    },
  },
};

module.exports = { Subscription };
