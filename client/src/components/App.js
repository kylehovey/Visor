import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';

import GridLayout from "react-grid-layout";

import AirChart from './modules/air_quality';
import Average from './modules/average';
import TradfriToggle from './modules/tradfri_toggle';

const asFreedom = c => (c * 9/5) + 32;

const carbonDioxideColor = "#689d6a";
const temperatureColor = "#fb4934";
const outsideTemperatureColor = "#b16286";
const relativeHumidityColor = "#458588";
const pm10Color = "#b16286";
const pm25Color = "#d3869b";
const pm100Color = "#f38019";
const outsidePm25Color = "#fabd2f";

const valuesOf = (data) => data.map(({ value }) => value);

export const SUBSCRIBE_AIR_READING = gql`
  subscription AirReading {
    airReading {
      createdAt
      pm10
      pm25
      pm100
    }
  }
`;

export const SUBSCRIBE_GAS_READING = gql`
  subscription GasReading {
    gasReading {
      createdAt
      carbonDioxide
      temperature
      relativeHumidity
    }
  }
`;

export const SUBSCRIBE_PURPLE_AIR = gql`
  subscription PurpleAir {
    purpleAir {
      createdAt
      lakemontPines {
        pm10
        pm25
        pm100
        temperature
      }
    }
  }
`;

export const GET_AIR_READINGS = gql`
  query AirReadings($timeFrom: Date!, $timeTo: Date!) {
    gasReading(timeFrom: $timeFrom, timeTo: $timeTo) {
      createdAt
      carbonDioxide
      temperature
      relativeHumidity
    }
    airReading(timeFrom: $timeFrom, timeTo: $timeTo) {
      createdAt
      pm10
      pm25
      pm100
    }
    purpleAir(timeFrom: $timeFrom, timeTo: $timeTo) {
      createdAt
      lakemontPines {
        pm10
        pm25
        pm100
        temperature
      }
    }
  }
`;

export const GET_TRADFRI_DEVICES = gql`
  query Tradfri {
    tradfriDevices {
      bulbs {
        id,
        name,
        type,
        status
      }
      plugs {
        id,
        name,
        type,
        status
      }
    }
  }
`;

const App = () => {
  const [ hoursBack, setHoursBack ] = useState(1);
  const [ timeTo, setTimeTo ] = useState(Date.now());
  const [ timeFrom, setTimeFrom ] = useState(timeTo - hoursBack * 60 * 60e3);
  const [ current, setCurrent ] = useState(null);
  const [ currentGasReading, setCurrentGasReading] = useState(null);
  const [ currentOutsidePm25, setCurrentOutsidePm25 ] = useState(null);
  const [ currentOutsideTemperature, setCurrentOutsideTemperature ] = useState(null);
  const [ carbonDioxideHistory, setCarbonDioxideHistory ] = useState([]);
  const [ temperatureHistory, setTemperatureHistory ] = useState([]);
  const [ relativeHumidityHistory, setRelativeHumidityHistory ] = useState([]);
  const [ pm10History, setPm10History ] = useState([]);
  const [ pm25History, setPm25History ] = useState([]);
  const [ pm100History, setPm100History ] = useState([]);
  const [ outsidePm25History, setOutsidePm25History ] = useState([]);
  const [ outsideTemperatureHistory, setOutsideTemperatureHistory ] = useState([]);
  const [ layout, setLayout ] = useState([
    { x: 0, y: 0, w: 1, h: 2 },

    { x: 1, y: 0, w: 2, h: 2 },
    { x: 3, y: 0, w: 2, h: 2 },
    { x: 5, y: 0, w: 2, h: 2 },
    { x: 7, y: 0, w: 2, h: 2 },
    { x: 9, y: 0, w: 2, h: 2 },
    { x: 11, y: 0, w: 2, h: 2 },

    { x: 0, y: 4, w: 8, h: 9 },
    { x: 8, y: 4, w: 8, h: 9 },
    { x: 0, y: 13, w: 8, h: 9 },
    { x: 8, y: 13, w: 8, h: 9 },
    { x: 0, y: 21, w: 8, h: 9 },
    { x: 8, y: 21, w: 8, h: 9 },

    ...(new Array(9)).fill().map((_, x) => ({ x, y: 2, w: 1, h: 2 })),
  ].map((base, i) => ({ ...base, i: i.toString() })));

  useEffect(() => {
    setTimeFrom(timeTo - hoursBack * 60 * 60e3);
    setTimeTo(Date.now());
  }, [hoursBack]);

  const { error: gasSensorError, } = useSubscription(SUBSCRIBE_GAS_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          gasReading,
        },
      } = subscriptionData;

      const {
        carbonDioxide,
        temperature,
        relativeHumidity,
        createdAt: time,
      } = gasReading;

      setCarbonDioxideHistory([...carbonDioxideHistory, { value: carbonDioxide, time }]);
      setTemperatureHistory([...temperatureHistory, { value: asFreedom(temperature), time }]);
      setRelativeHumidityHistory([...relativeHumidityHistory, { value: relativeHumidity, time }]);
      setCurrentGasReading(gasReading);
    },
  });

  const { error: airSensorError, } = useSubscription(SUBSCRIBE_AIR_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          airReading,
        },
      } = subscriptionData;

      const {
        pm10,
        pm25,
        pm100,
        createdAt: time,
      } = airReading;

      setPm10History([...pm10History, { value: pm10, time }]);
      setPm25History([...pm25History, { value: pm25, time }]);
      setPm100History([...pm100History, { value: pm100, time }]);
      setCurrent(airReading);
    },
  });

  const { error: purpleAirError, } = useSubscription(SUBSCRIBE_PURPLE_AIR, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          purpleAir: {
            createdAt: time,
            lakemontPines: {
              pm25,
              temperature,
            },
          },
        },
      } = subscriptionData;

      setOutsidePm25History([...outsidePm25History, { value: pm25, time }]);
      setOutsideTemperatureHistory([
        ...outsideTemperatureHistory,
        { value: asFreedom(temperature), time },
      ]);
      setCurrentOutsidePm25(pm25);
      setCurrentOutsideTemperature(asFreedom(temperature));
    },
  });

  const {
    loading: tradfriLoading,
    error: tradfriError,
    data: tradfriData,
  } = useQuery(GET_TRADFRI_DEVICES);

  useQuery(GET_AIR_READINGS, {
    variables: {
      timeFrom,
      timeTo,
    },
    onCompleted: ({ airReading, gasReading, purpleAir }) => {
      const [ latest ] = airReading.slice(-1);
      const [ latestGas ] = gasReading.slice(-1);
      const [ latestOutside ] = purpleAir.slice(-1);

      setCarbonDioxideHistory(gasReading.map(({
        carbonDioxide: value,
        createdAt: time,
      }) => ({ value, time })));

      setTemperatureHistory(gasReading.map(({
        temperature: value,
        createdAt: time,
      }) => ({ value: asFreedom(value), time })));

      setRelativeHumidityHistory(gasReading.map(({
        relativeHumidity: value,
        createdAt: time,
      }) => ({ value, time })));

      setPm10History(airReading.map(({ pm10: value, createdAt: time }) => ({ value, time })));
      setPm25History(airReading.map(({ pm25: value, createdAt: time }) => ({ value, time })));
      setPm100History(airReading.map(({ pm100: value, createdAt: time }) => ({ value, time })));
      setOutsideTemperatureHistory([
        ...purpleAir.map(({
          lakemontPines: {
            temperature: value,
          },
          createdAt: time,
        }) => ({ value: asFreedom(value), time })),
      ]);
      setOutsidePm25History([
        ...purpleAir.map(({
          lakemontPines: {
            pm25: value,
          },
          createdAt: time,
        }) => ({ value, time })),
      ]);

      if (currentGasReading === null && latestGas !== undefined) {
        setCurrentGasReading(latestGas);
      }

      if (current === null && latest !== undefined) {
        setCurrent(latest);
      }

      if (currentOutsidePm25 === null && latestOutside !== undefined) {
        setCurrentOutsidePm25(latestOutside.lakemontPines.pm25);
      }

      if (currentOutsideTemperature === null && latestOutside !== undefined) {
        setCurrentOutsideTemperature(asFreedom(latestOutside.lakemontPines.temperature));
      }
    },
  });

  if (
    tradfriLoading ||
    current === null ||
    currentGasReading === null ||
    currentOutsideTemperature === null
  ) {
    return 'Loading...';
  }

  if (gasSensorError) return JSON.stringify(gasSensorError);
  if (airSensorError) return JSON.stringify(airSensorError);
  if (purpleAirError) return JSON.stringify(purpleAirError);
  if (tradfriError) return JSON.stringify(tradfriError);

  const { pm25 } = current;
  const {
    carbonDioxide,
    temperature,
    relativeHumidity,
  } = currentGasReading;
  const {
    tradfriDevices: {
      bulbs,
      plugs,
    },
  } = tradfriData;

  const modules = [
    () => (
      <div>
        <h3>Tomahna Statistics</h3>
      </div>
    ),

    () => <Average
      values={valuesOf(pm25History)}
      title="PM2.5"
      units="µg/m³"
      color={pm25Color}
    />,
    () => <Average
      values={valuesOf(outsidePm25History)}
      title="Outdoor PM2.5"
      units="µg/m³"
      color={outsidePm25Color}
    />,
    () => <Average
      values={valuesOf(carbonDioxideHistory)}
      title="CO2"
      units="ppm"
      color={carbonDioxideColor}
    />,
    () => <Average
      values={valuesOf(temperatureHistory)}
      title="Temperature"
      units="˚F"
      color={temperatureColor}
    />,
    () => <Average
      values={valuesOf(relativeHumidityHistory)}
      title="Humidity"
      units="%"
      color={relativeHumidityColor}
    />,

    () => (
      <div>
        <label htmlFor="hoursBack">Hours of History</label>
        <input
          id="hoursBack"
          type="number"
          value={hoursBack}
          onChange={({ target }) => setHoursBack(target.value)}
        />
      </div>
    ),

    //() => <AirChart
    //  title={`PM1.0: ${pm10}µg/m³`}
    //  values={pm10History}
    //  color={pm10Color}
    ///>,
    () => <AirChart
      title={`PM2.5: ${pm25}µg/m³`}
      values={pm25History}
      color={pm25Color}
    />,
    //() => <AirChart
    //  title={`PM10.0: ${pm100}µg/m³`}
    //  values={pm100History}
    //  color={pm100Color}
    ///>,
    () => <AirChart
      title={`Outside PM2.5: ${currentOutsidePm25}µg/m³`}
      values={outsidePm25History}
      color={outsidePm25Color}
    />,
    () => <AirChart
      title={`CO2: ${carbonDioxide.toFixed(2)}ppm`}
      values={carbonDioxideHistory}
      color={carbonDioxideColor}
    />,
    () => <AirChart
      title={`Temperature: ${asFreedom(temperature).toFixed(2)}˚F`}
      values={temperatureHistory}
      color={temperatureColor}
    />,
    () => <AirChart
      title={`Relative Humidity: ${relativeHumidity.toFixed(2)}%`}
      values={relativeHumidityHistory}
      color={relativeHumidityColor}
    />,
    () => <AirChart
      title={`Outside Temperature: ${currentOutsideTemperature.toFixed(2)}˚F`}
      values={outsideTemperatureHistory}
      color={outsideTemperatureColor}
    />,

    ...bulbs.map((bulb) => () => (
      <TradfriToggle
        key={`tradfri-${bulb.id}`}
        {...bulb}
      />
    )),

    ...plugs.map((plug) => () => (
      <TradfriToggle
        key={`tradfri-${plug.id}`}
        {...plug}
      />
    )),
  ].map((component, i) => ({ component, key: `${i}` }));

  return (
    <div className="container">
      <div className="content">
        <GridLayout
          items={layout.length}
          rowHeight={30}
          width={2500}
          cols={24}
          layout={layout}
          onLayoutChange={setLayout}
          className="layout"
          compactType={null}
          isDraggable={false}
        >
          {modules.map(({ key, component }) => (
            <div
              key={key}
              className="grid-module"
            >
              <div className="grid-module-content">
                {component()}
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}

export default App;
