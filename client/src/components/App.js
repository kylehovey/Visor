import React, { useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

import Chart from './visualization/chart';

export const GET_AIR_READING = gql`
  subscription AirReading {
    airReading {
      pm25
    }
  }
`;

const App = () => {
  const [ history, setHistory ] = useState([]);

  const { error: subscriptionError } = useSubscription(GET_AIR_READING, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          airReading: {
            pm25,
          },
        },
      } = subscriptionData;

      setHistory([...history, pm25]);
    },
  });

  if (subscriptionError) return JSON.stringify(subscriptionError);

  return (
    <div className="container">
      <div className="content">
        <div className="main">
          <div className="description">
            <h2>Tomahna Environment Statistics</h2>
          </div>
          <Chart title="Air Quality" values={history} units="ug/m3" />
        </div>
      </div>
    </div>
  );
}

export default App;
