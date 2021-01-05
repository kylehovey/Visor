const TradfriToggle = ({ id, name, status }) => {
  return (
    <div className="tradfri-toggle-container">
      <button
        className={status > 0 ? 'on' : 'off'}
      >
        {name}
      </button>
    </div>
  );
};

export default TradfriToggle;
