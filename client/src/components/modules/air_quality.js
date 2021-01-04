import Chart from '../visualization/chart';

const AirChart = ({ title, values }) => {
  return (
    <div>
      <Chart
        title={title}
        values={[values]}
        units="µg/m³"
      />
    </div>
  );
};

export default AirChart;
