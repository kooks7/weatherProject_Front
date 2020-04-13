import React from 'react';
import PropTypes from 'prop-types';

function Forecast({ time, temp, feels_like, image, weather }) {
  return (
    <div className="forecast">
      <img src={image} alt={time} title={time} className="forecast_image" />
      <div className="forcast_data">
        <h2 className="forecast_time">시 간 :{time}</h2>
        <h3 className="forecast_weather">날 씨 : {weather}</h3>
        <h3 className="forecast_weather">온 도 :{temp}</h3>
        <h3 className="forecast_weather">체감 온도 : {feels_like}</h3>
        {/* <a href="localhost:4000">출격가능?</a> */}
      </div>
    </div>
  );
}

Forecast.propTypes = {
  id: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  feels_like: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  weather: PropTypes.string.isRequired
  //   값이 배열이면 추가하는 방법 : PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Forecast;
