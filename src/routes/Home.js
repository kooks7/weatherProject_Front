import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Forecast from '../components/Forecast';
import ForecastDetail from '../components/ForecastDetail';
import Foot from '../components/Foot';
class Home extends Component {
  state = {
    isLoading: true,
    forecastData: {},
    coord: {
      latitude: undefined,
      longitude: undefined
    },
    keyword: '',
    searchedCity: ''
  };

  // 1. 함수 : 날씨 정보 가져오는 함수
  getWeather = (
    latitude = this.state.coord.latitude,
    longitude = this.state.coord.longitude
  ) => {
    console.log('실행');
    const graphqlQuery = {
      query: `
      query getWeatherByLocaiton($latitude: String!,$longitude: String! )
            {
                getWeather(latitude: $latitude, longitude: $longitude) {
                    city
                    country
                weathers{
                  id
                  time
                  temp
                  feels_like
                  condition
                  humidity
                  wind_speed
                  temp_min
                  temp_max
                  rain
                }
              }
            }      
                `,
      variables: {
        latitude: latitude,
        longitude: longitude
      }
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 2. 함수 브라우저를 통해 위치 정보 가져오는 함수
  getLocation = () => {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // alert('위치가 확인되었습니다');
          this.setState({
            coord: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          });

          // 날씨 정보 가져오기
          this.getWeather(
            position.coords.latitude.toString(),
            position.coords.longitude.toString()
          );
        },
        function (error) {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity
        }
      );
    } else {
      alert('위치정보를 지원하지 않습니다');
    }
  };

  // 4. 함수 : 검색 기능

  componentDidMount() {
    if (!this.state.coord.latitude) {
      this.getLocation();
    }
  }
  componentDidUpdate() {
    if (!this.state.coord.latitude) {
      console.log('update');
    }
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
            <ForecastDetail
              wind_speed={forecasts[0].wind_speed}
              temp={forecasts[0].temp}
              city={normalData.city}
              country={normalData.country}
              humidity={forecasts[0].humidity}
              temp_max={forecasts[0].temp_max}
              temp_min={forecasts[0].temp_min}
            />
            <Body>
              {forecasts.map((f) => (
                <div key={f.id}>
                  <Forecast
                    id={f.id}
                    time={f.time}
                    temp={f.temp}
                    condition={f.condition}
                    city={normalData.city}
                    country={normalData.country}
                    feels_like={f.feels_like}
                  />
                </div>
              ))}
            </Body>
            <Foot getWeather={this.getWeather} />
          </Container>
        )}
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
body{
  position: relative;
  font-family: Nanum Gothic, sans-serif; 
  color: white;
  background: url(http://localhost:3000/sky.jpg);
  background-size : cover;
  height: 100%;
  overflow: hidden;
}
  html{
    height: 100vh;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

export default Home;
