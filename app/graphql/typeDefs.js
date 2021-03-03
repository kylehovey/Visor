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

  type PurpleAirReading {
    pm10: Int
    pm25: Int
    pm100: Int
    temperature: Float
    createdAt: Date
  }

  type GasReading {
    temperature: Float
    relativeHumidity: Float
    carbonDioxide: Float
    createdAt: Date
  }

  type PurpleAir {
    createdAt: Date
    lakemontPines: PurpleAirReading
  }

  type Query {
    tradfriDevices: TradfriDeviceResult
    airReading(timeFrom: Date!, timeTo: Date!): [AirReading]
    gasReading(timeFrom: Date!, timeTo: Date!): [GasReading]
    purpleAir(timeFrom: Date!, timeTo: Date!): [PurpleAir]
  }

  type Subscription {
    airReading: AirReading
    gasReading: GasReading
    purpleAir: PurpleAir
  }

  type Mutation {
    setTradfriStatus(id: String!, type: TradfriDeviceType!, status: Int!): Boolean
  }
`;

module.exports = { typeDefs };
