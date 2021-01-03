import React, { useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

import Chart from '../visualization/chart';

export const GET_AIR_READING = gql`
  subscription AirReading {
    airReading {
      pm25
    }
  }
`;

const AirChart = () => {
  const [ current, setCurrent ] = useState(null);
  const [ history, setHistory ] = useState([]);

  const {
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(GET_AIR_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          airReading: {
            pm25,
          },
        },
      } = subscriptionData;

      setHistory([...history, pm25]);
      setCurrent(pm25);
    },
  });

  if (subscriptionLoading) return 'Loading...';
  if (subscriptionError) return JSON.stringify(subscriptionError);

  return (
    <div>
      <Chart
        title={`Particulate: ${current}µg/m³`}
        values={history}
        units="µg/m³"
      />
    </div>
  );
};

export default AirChart;
