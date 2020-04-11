import React from 'react';
import PropTypes from 'prop-types';

function Forecast({ id, time, temp, feels_like }) {
  return (
    <div>
      <h3>{time}</h3>
      <h4>{temp}</h4>
      <h4>{feels_like}</h4>
    </div>
  );
}

Forecast.propTypes = {
  _id: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  temp: PropTypes.number.isRequired,
  feels_like: PropTypes.number.isRequired
};

export default Forecast;
