import React, { Component } from 'react';
import Forecast from '../components/Forecast';
import styled, { createGlobalStyle } from 'styled-components';

class Home extends Component {
  state = {
    isLoading: true,
    forecastData: {}
  };

  getWeather = () => {
    const graphqlQuery = {
      query: `
            {
                getWeather(latitude:"37.4999", longitude:"127.0374") {
                    city
                gu
                weathers{
                  time
                  temp
                  feels_like
                  condition
                }
              }
            }      
                `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error('에러');
        }

        this.setState({
          forecastData: resData.data.getWeather,
          isLoading: false
        });
        console.log(this.state.forecastData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 옷 가져오는 함수
  getClothes = () => {
    // 1. 해당 온도 가져오기
    // 2. 온도 붙여서 쿼리 보내주기
    // 3. 쿼리 결과 받아와서 type별로 정렬하기
    // 4. 렌더링 하기
  };
  // 검색 기능
  citySearching = () => {};

  componentDidMount() {
    this.getWeather();
  }

  render() {
    const forecasts = this.state.forecastData.weathers;
    const normalData = this.state.forecastData;
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading ? (
          <div> Loding ... </div>
        ) : (
          <Container>
            <GlobalStyle />
            <Header>
              <Headertemp>{forecasts[0].temp}°C</Headertemp>
              <Location>{normalData.gu},</Location>
              <Location>{normalData.city}</Location>
            </Header>
            <Neck>목 입니다</Neck>
            <Body>
              {forecasts.map((f) => (
                <div>
                  <Forecast
                    key={f.time}
                    id={f.time}
                    time={f.time}
                    temp={f.temp}
                    condition={f.condition}
                    city={normalData.city}
                    feels_like={f.feels_like}
                  />
                </div>
              ))}
            </Body>

            <Footer>
              <Nav>네비게이션</Nav>
              발입니다
            </Footer>
          </Container>
        )}
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
body{
  font-family: Nanum Gothic, sans-serif; 
  color: white;
  background: linear-gradient(
      to right,
      rgba(20, 20, 20, 0.1) 10%,
      rgba(20, 20, 20, 0.125) 70%,
      rgba(20, 20, 20, 0.15)
    ),url(http://localhost:3000/sky.jpg);
    background-size : cover;
    width: 90%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
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
  /* border: 1px solid black; */
`;
const Body = styled.div`
  flex: 2;
  /* border: 1px solid black; */
  display: flex;
  /* justify-content: space-between; */
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  flex: 1;
  display: flex;
  /* border: 1px solid black; */
`;
const Nav = styled.div`
  /* border: 1px solid black; */
`;

export default Home;
