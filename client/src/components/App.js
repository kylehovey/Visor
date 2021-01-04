import React, { useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

import GridLayout from "react-grid-layout";

import AirChart from './modules/air_quality';
import Average from './modules/average';

const pm10Color = "rgb(245, 126, 127)";
const pm25Color = "rgb(239, 129, 255)";
const pm100Color = "rgb(255, 169, 71)";
const outsidePm25Color = "rgb(0, 169, 71)";

const valuesOf = (data) => data.map(({ value }) => value);

export const GET_AIR_READING = gql`
  subscription AirReading {
    airReading {
      pm10
      pm25
      pm100
    }
  }
`;

export const GET_PURPLE_AIR = gql`
  subscription PurpleAir {
    purpleAir {
      lakemontPines {
        pm10
        pm25
        pm100
      }
    }
  }
`;

const App = () => {
  const [ current, setCurrent ] = useState(null);
  const [ currentOutsidePm25, setCurrentOutsidePm25 ] = useState(null);
  const [ pm10History, setPm10History ] = useState([]);
  const [ pm25History, setPm25History ] = useState([]);
  const [ pm100History, setPm100History ] = useState([]);
  const [ outsidePm25History, setOutsidePm25History ] = useState([]);
  const [ layout, setLayout ] = useState([
    { x: 0, y: 0, w: 1, h: 2 },

    { x: 1, y: 0, w: 1, h: 2 },
    { x: 2, y: 0, w: 1, h: 2 },
    { x: 3, y: 0, w: 1, h: 2 },
    { x: 4, y: 0, w: 1, h: 2 },

    { x: 0, y: 2, w: 4, h: 9 },
    { x: 4, y: 2, w: 4, h: 9 },
    { x: 0, y: 11, w: 4, h: 9 },
    { x: 4, y: 11, w: 4, h: 9 },
  ].map((base, i) => ({ ...base, i: i.toString() })));

  const { error: airSensorError, } = useSubscription(GET_AIR_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          airReading,
        },
      } = subscriptionData;
      const { pm10, pm25, pm100 } = airReading;

      const time = new Date().getTime();

      setPm10History([...pm10History, { value: pm10, time }]);
      setPm25History([...pm25History, { value: pm25, time }]);
      setPm100History([...pm100History, { value: pm100, time }]);
      setCurrent(airReading);
    },
  });

  const { error: purpleAirError, } = useSubscription(GET_PURPLE_AIR, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          purpleAir: {
            lakemontPines: {
              pm25,
            },
          },
        },
      } = subscriptionData;

      const time = new Date().getTime();

      setOutsidePm25History([...outsidePm25History, { value: pm25, time }]);
      setCurrentOutsidePm25(pm25);
    },
  });

  if (current === null) return 'Loading...';
  if (airSensorError) return JSON.stringify(airSensorError);
  if (purpleAirError) return JSON.stringify(purpleAirError);

  const { pm10, pm25, pm100 } = current;

  const modules = [
    () => (
      <div>
        <h3>Tomahna Statistics</h3>
      </div>
    ),
    () => <Average
      values={valuesOf(pm10History)}
      title="PM1.0"
      units="µg/m³"
      color={pm25Color}
    />,
    () => <Average
      values={valuesOf(pm25History)}
      title="PM2.5"
      units="µg/m³"
      color={pm10Color}
    />,
    () => <Average
      values={valuesOf(pm100History)}
      title="PM10.0"
      units="µg/m³"
      color={pm100Color}
    />,
    () => <Average
      values={valuesOf(outsidePm25History)}
      title="Outdoor PM2.5"
      units="µg/m³"
      color={outsidePm25Color}
    />,
    () => <AirChart
      title={`PM1.0: ${pm10}µg/m³`}
      values={pm10History}
      color={pm10Color}
    />,
    () => <AirChart
      title={`PM2.5: ${pm25}µg/m³`}
      values={pm25History}
      color={pm25Color}
    />,
    () => <AirChart
      title={`PM10.0: ${pm100}µg/m³`}
      values={pm100History}
      color={pm100Color}
    />,
    () => <AirChart
      title={`Outside PM2.5: ${currentOutsidePm25}µg/m³`}
      values={outsidePm25History}
      color={outsidePm25Color}
    />,
  ].map((component, i) => ({ component, key: `${i}` }));

  return (
    <div className="container">
      <div className="content">
        <GridLayout
          items={layout.length}
          rowHeight={30}
          width={2500}
          cols={12}
          layout={layout}
          onLayoutChange={setLayout}
          className="layout"
          verticalCompact={false}
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
