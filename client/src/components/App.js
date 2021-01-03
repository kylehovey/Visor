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
          <span>Current Value: {history.slice(-1)[0]}µg/m³</span>
          <Chart title="Air Quality" values={history} units="µg/m³" />
        </div>
      </div>
    </div>
  );
}

export default App;
