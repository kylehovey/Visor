import React, { useState, useEffect } from 'react';
import { useSubscription, gql } from '@apollo/client';

import GridLayout from "react-grid-layout";

import AirChart from './modules/air_quality';

export const GET_AIR_READING = gql`
  subscription AirReading {
    airReading {
      pm10
      pm25
      pm100
    }
  }
`;

const App = () => {
  const [ current, setCurrent ] = useState(null);
  const [ pm10History, setPm10History ] = useState([]);
  const [ pm25History, setPm25History ] = useState([]);
  const [ pm100History, setPm100History ] = useState([]);
  const [ layout, setLayout ] = useState([
    { x: 0, y: 0, w: 2, h: 2, i: "0" },
    { x: 4, y: 2, w: 4, h: 9, i: "1" },
    { x: 0, y: 2, w: 4, h: 9, i: "2" },
    { x: 0, y: 11, w: 4, h: 9, i: "3" },
  ]);

  useEffect(() => {
    console.log(layout);
  }, [layout]);

  const {
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(GET_AIR_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          airReading,
        },
      } = subscriptionData;
      const { pm10, pm25, pm100 } = airReading;

      setPm10History([...pm10History, pm10]);
      setPm25History([...pm25History, pm25]);
      setPm100History([...pm100History, pm100]);
      setCurrent(airReading);
    },
  });

  if (current === null) return 'Loading...';
  if (subscriptionError) return JSON.stringify(subscriptionError);

  const { pm10, pm25, pm100 } = current;

  const modules = [
    () => <h1>Tomahna Statistics</h1>,
    () => <AirChart
      title={`PM1.0: ${pm10}µg/m³`}
      values={pm10History}
    />,
    () => <AirChart
      title={`PM2.5: ${pm25}µg/m³`}
      values={pm25History}
    />,
    () => <AirChart
      title={`PM10.0: ${pm100}µg/m³`}
      values={pm100History}
    />,
  ].map((component, i) => ({ component, key: `${i}` }));

  return (
    <div className="container">
      <div className="content">
        <GridLayout
          items={layout.length}
          rowHeight={30}
          width={3000}
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
