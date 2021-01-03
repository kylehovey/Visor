import React, { useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

import AirChart from './modules/air_quality';

const App = () => {

  return (
    <div className="container">
      <div className="content">
        <h2>Tomahna Environment Statistics</h2>
        <AirChart />
      </div>
    </div>
  );
}

export default App;
