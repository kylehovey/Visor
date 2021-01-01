const { buildSchema } = require('graphql');

// This is a no-op tag so I can get GraphQL syntax highlighting
const gql = ([x])=>x;

module.exports = buildSchema(gql`
  type Query {
    hello: String
  }
`);
