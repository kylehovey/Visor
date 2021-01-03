import { useState } from 'react';
import GridLayout from "react-grid-layout";

import AirChart from './modules/air_quality';

const App = () => {
  const [ layout, setLayout ] = useState([
    { x: 0, y: 0, w: 3, h: 2, i: "0" },
    { x: 0, y: 10, w: 8, h: 9, i: "1" },
  ]);

  const modules = [
    {
      key: "0",
      component: () => <h1>Tomahna Statistics</h1>,
    },{
      key: "1",
      component: () => <AirChart />,
    }
  ];

  return (
    <div className="container">
      <div className="content">
        <GridLayout
          items={layout.length}
          rowHeight={30}
          width={1250}
          cols={12}
          layout={layout}
          onLayoutChange={setLayout}
          className="layout"
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
