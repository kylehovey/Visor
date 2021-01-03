const Subscription = {
  airReading: {
    subscribe: (root, variables, context) => {
      const { pubsub, topics } = context;

      return pubsub.asyncIterator([topics.AIR_READING_TOPIC]);
    },
  },
};

module.exports = { Subscription };
