const { pubsub, topics } = require('..');

setInterval(() => {
  pubsub.publish(
    topics.AIR_READING_TOPIC,
    {
      airReading: {
        pm25: Math.round(100*Math.random()),
      },
    },
  );
}, 1000);
