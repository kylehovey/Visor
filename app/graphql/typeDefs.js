const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  enum TradfriDeviceType {
    plug
    bulb
  }

  type TradfriDevice {
    id: ID
    name: String
    type: TradfriDeviceType
    status: Int
  }

  type TradfriDeviceResult {
    bulbs: [TradfriDevice]
    plugs: [TradfriDevice]
  }

  type AirReading {
    pm10: Int
    pm25: Int
    pm100: Int
    createdAt: Date
  }

  type PurpleAir {
    lakemontPines: AirReading
  }

  type Query {
    tradfriDevices: TradfriDeviceResult
    airReading(timeFrom: Date!, timeTo: Date!): [AirReading]
    purpleAir(timeFrom: Date!, timeTo: Date!): [PurpleAir]
  }

  type Subscription {
    airReading: AirReading
    purpleAir: PurpleAir
  }

  type Mutation {
    setTradfriStatus(id: String!, type: TradfriDeviceType!, status: Int!): Boolean
  }
`;

module.exports = { typeDefs };
