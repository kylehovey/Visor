const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type AirReading {
    id: ID!
    pm25: Int
    createdAt: Date
  }

  type Query {
    status: Boolean!
  }

  type Subscription {
    airReading: AirReading
  }

  type Mutation {
    nothing: Boolean
  }
`;

module.exports = { typeDefs };
