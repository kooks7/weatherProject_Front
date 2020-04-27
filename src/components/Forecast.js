import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as reactIcon from 'react-icons/wi';
import ModalPortal from '../components/ModalPortal';
import Detail from '../components/Detail';

const Container = styled.div`
  background-color: rgba(140, 000, 100, 0.38);
  /* display: flex; */
  height: 70%;
  background-size: contain;
  background-position: top;
  background: cover;
  padding: 5px 40px 50px 40px;
  margin: 30px -30px 30px 40px;
  align-items: baseline;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const Idiv = styled.div`
  font-size: 5em;
  margin-bottom: -20px;
`;
const Time = styled.h2`
  font-size: 20px;
`;
const Temp = styled.h3`
  font-size: 25px;
`;
const Condition = styled.h3`
  font-size: 25x;
`;
const Modal = styled.button``;

class Forecast extends Component {
  state = {
    modal: false
  };

  handleOpenModal = () => {
    this.setState({
      modal: true
    });
  };
  handleCloseModal = () => {
    this.setState({
      modal: false
    });
  };

  // condition 에러 처리 없으면 우선 Clear로 해놓기
  render() {
    const { id, time, temp, condition, city, feels_like } = this.props;
    if (!weatherOptions[condition]) {
      this.props.condition = 'Clear';
    }
    const Icon = reactIcon[weatherOptions[condition].iconName];
    // 시간 처리
    const timeData = new Date(time * 1000);
    console.log(timeData.toLocaleTimeString().split(':'));
    const timeObj = {
      Month: timeData.getMonth() + 1,
      Date: timeData.getDate(),
      Time: timeData.toLocaleTimeString().split(':')
    };

    return (
      <Container>
        <Time>{timeObj.Time[0] + ':' + timeObj.Time[2]}</Time>
        <Idiv>
          <Icon />
        </Idiv>
        <Temp>{temp}°C</Temp>
        <Condition>{weatherOptions[condition].kor}</Condition>
        <Modal onClick={this.handleOpenModal}>열기</Modal>
        {this.state.modal && (
          <ModalPortal>
            <Detail
              onClose={this.handleCloseModal}
              time={timeObj.Time[0] + ':' + timeObj.Time[2]}
              temp={temp}
              feels_like={feels_like}
            />
          </ModalPortal>
        )}
      </Container>
    );
  }
}

Forecast.propType = {
  id: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  temp: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired
};

const weatherOptions = {
  Thunderstorm: {
    iconName: 'WiNightAltSleetStorm',
    kor: '천둥번개',
    subtitle: '벼락을 조심하세요'
  },
  Drizzle: {
    iconName: 'WiDayHail',
    kor: '이슬비',
    subtitle: '부슬부슬 이슬비'
  },
  Rain: {
    iconName: 'WiUmbrella',
    kor: '비',
    subtitle: '비가 내립니다'
  },
  Snow: {
    iconName: 'WiSnowWind',
    kor: '눈',
    subtitle: '하늘에서 눈이옵니다.'
  },
  Haze: {
    iconName: 'WiDust',
    kor: '미세먼지',
    subtitle: '마스크를 꼭 착용하세요.'
  },
  Clear: {
    iconName: 'WiSunset',
    kor: '맑음',
    subtitle: '날씨가 정말 맑아요.'
  },
  Clouds: {
    iconName: 'WiCloud',
    kor: '구름',
    subtitle: '구름낀 날씨입니다.'
  }
};

export default Forecast;
