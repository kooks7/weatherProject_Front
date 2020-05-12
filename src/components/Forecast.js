import React, { Component } from 'react';
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

const Link = styled.a``;

const Idiv = styled.div`
  font-size: 8em;
  margin-top: 20px;
`;
const Time = styled.h2`
  font-size: 17px;
`;
const Temp = styled.h3`
  font-size: 40x;
  font-weight: 30;
`;
const Condition = styled.h3`
  font-size: 40x;
  font-weight: 30;
`;

class Forecast extends Component {
  state = {
    modal: false
  };

  handleOpenModal = () => {
    this.setState({
      modal: true
    });
  };
  handleCloseModal = (e) => {
    console.log(e);
    this.setState({
      modal: false
    });
  };

  // condition 에러 처리 없으면 우선 Clear로 해놓기
  render() {
    const { id, time, temp, condition, city, country, feels_like } = this.props;
    if (!weatherOptions[condition]) {
      this.props.condition = 'Clear';
    }
    const Icon = reactIcon[weatherOptions[condition].iconName];
    // 시간 처리
    const timeData = new Date(time * 1000);
    const timeObj = {
      Month: timeData.getMonth() + 1,
      Date: timeData.getDate(),
      Day: timeData.getDay(),
      Time: timeData.toLocaleTimeString().split(':')
    };
    console.log(timeObj);
    return (
      <>
        <Container onClick={this.handleOpenModal}>
          <Link>
            <Time>{chnageDay[timeObj.Day] + ' ' + timeObj.Date}</Time>
            <Time>{timeObj.Time[0] + ':' + timeObj.Time[2]}</Time>
            <Idiv>
              <Icon />
            </Idiv>
            <Temp>{temp}°C</Temp>
            <Condition>{weatherOptions[condition].kor}</Condition>
          </Link>
        </Container>
        {this.state.modal && (
          <ModalPortal>
            <Detail
              country={country}
              city={city}
              id={id}
              onClose={this.handleCloseModal}
              time={
                chnageDay[timeObj.Day] +
                '요일 ' +
                timeObj.Date +
                '일 ' +
                timeObj.Time[0] +
                ':' +
                timeObj.Time[2]
              }
              temp={temp}
              feels_like={feels_like}
            />
          </ModalPortal>
        )}
      </>
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

const chnageDay = {
  '1': '월',
  '2': '화',
  '3': '수',
  '4': '목',
  '5': '금',
  '6': '토',
  '7': '일'
};

export default Forecast;
