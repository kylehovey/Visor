const { PubSub } = require('graphql-subscriptions');

const topics = require('./topics');

const pubsub = new PubSub();

module.exports = { pubsub, topics };

require('./publishers');
require('./chroniclers');
