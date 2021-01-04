const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type AirReading {
    pm10: Int
    pm25: Int
    pm100: Int
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
