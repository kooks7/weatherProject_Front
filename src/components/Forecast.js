import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
`;
const Icon = styled.div`
  font-size: 32px;
`;
const Time = styled.h1`
  font-size: 32px;
`;
const Temp = styled.h2`
  font-size: 32px;
`;
const Condition = styled.h2`
  font-size: 32px;
`;

const Forecast = ({ id, time, temp, condition }) => {
  return (
    <Container>
      <Link
        to={{
          pathname: `/forecast/${id}`,
          state: {
            time,
            temp,
            condition
          }
        }}
      >
        <Time>{time}</Time>
        <Icon></Icon>
        <Temp>{temp}</Temp>
        <Condition>{condition}</Condition>
      </Link>
    </Container>
  );
};

Forecast.propType = {
  id: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  temp: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired
};

export default Forecast;
