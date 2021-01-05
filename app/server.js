require('dotenv-flow').config();

const path = require('path');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const buildApolloWith = require('./graphql');

const { pubsub, topics } = require('./subscriptions');
const models = require('./models');
const tradfriPromise = require('./lib/tradfri');

const app = express();
const server = http.createServer(app);

(async () => {
  const apollo = buildApolloWith({
    context: {
      models,
      pubsub,
      topics,
      tradfriClient: await tradfriPromise,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  }

  app.use(express.static(path.join(__dirname, '../client/build')));

  apollo.applyMiddleware({ app });
  apollo.installSubscriptionHandlers(server);

  server.listen(process.env.PORT);
})();
