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
  }

  type PurpleAir {
    lakemontPines: AirReading
  }

  type Query {
    tradfriDevices: TradfriDeviceResult
  }

  type Subscription {
    airReading: AirReading
    purpleAir: PurpleAir
  }

  type Mutation {
    nothing: Boolean
  }
`;

module.exports = { typeDefs };
