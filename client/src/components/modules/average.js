const averageOf = (values) => (
  values.reduce((a,b) => a+b, 0) / values.length
).toFixed(2);

const Average = ({ values, title, units, color }) => {
  const average = (
    <span
      className="average-value"
      style={{ color }}
    >
      {averageOf(values)} {units}
    </span>
  );

  return (
    <div className="average-container">
      <span className="average-content">Average {title}:</span>
      <br />
      <div className="average-value-container">
        {average}
      </div>
    </div>
  );
};

export default Average;
