import Chart from '../visualization/chart';

const AirChart = ({ title, values, color }) => {
  return (
    <div>
      <Chart
        title={title}
        values={[values]}
        units="µg/m³"
        color={color}
      />
    </div>
  );
};

export default AirChart;
