const { ApolloServer } = require('apollo-server-express');

const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

module.exports = (extras = {}) => new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    endpoint: '/graphql',
  },
  ...extras,
});
