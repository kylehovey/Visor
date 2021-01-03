import PropTypes from 'prop-types';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';

const asVis = values => values.map((y, x) => ({ x, y }));

const Chart = ({ title, values, units }) => {
  return (
    <div>
      <h3>{title}</h3>
      <XYPlot height={300} width={800}>
        <XAxis title="seconds" />
        <YAxis title={units} />
        <HorizontalGridLines />
        <VerticalGridLines />
        <LineSeries
          data={asVis(values)}
          curve="curveMonotoneX"
        />
      </XYPlot>
    </div>
  );
}

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Chart;
