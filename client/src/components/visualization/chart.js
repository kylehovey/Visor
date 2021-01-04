import PropTypes from 'prop-types';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';

const asVis = values => values.map(({ value: y, time: x }) => ({ x, y }));

const Chart = ({ title, values, units, color }) => {
  return (
    <div>
      <h3>{title}</h3>
      <XYPlot
        xType="time"
        height={300}
        width={800}
      >
        <XAxis />
        <YAxis title={units} />
        <HorizontalGridLines />
        <VerticalGridLines />
        {values.map((data, i) => (
          <LineSeries
            key={`${title}-${i}`}
            data={asVis(data)}
            curve="curveMonotoneX"
            color={color}
          />
        ))}
      </XYPlot>
    </div>
  );
}

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        time: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
};

export default Chart;
