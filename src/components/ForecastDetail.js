import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ForecastDetail = ({
  wind_speed,
  temp,
  gu,
  city,
  humidity,
  temp_max,
  temp_min
}) => {
  return (
    <>
      <Header>
        <Headertemp>{temp}°C</Headertemp>
        <Location>{gu},</Location>
        <Location>{city}</Location>
      </Header>
      <Neck>
        <WeatherDetail>습도 :{humidity}%</WeatherDetail>
        <WeatherDetail>최저 온도 :{temp_min}°C</WeatherDetail>
        <WeatherDetail>최고 온도 :{temp_max}°C</WeatherDetail>
        <WeatherDetail>풍 속 :{wind_speed} km/h</WeatherDetail>
      </Neck>
    </>
  );
};

ForecastDetail.propType = {
  wind_speed: PropTypes.number.isRequired,
  temp: PropTypes.number.isRequired,
  gu: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  temp_max: PropTypes.number.isRequired,
  temp_min: PropTypes.number.isRequired
};

const Header = styled.div`
  flex: 1;
  display: flex;
  /* border: 1px solid black; */
  align-items: baseline;
`;
const Headertemp = styled.h1`
  font-size: 5rem;
  padding-left: 20px;
  padding-right: 20px;
`;
const Location = styled.h1``;
const Neck = styled.div`
  display: flex;
`;
const WeatherDetail = styled.h3``;

export default ForecastDetail;
