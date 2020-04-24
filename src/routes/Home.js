import React, { Component } from 'react';
import Forecast from '../components/Forecast';

class Home extends Component {
  state = {
    isLoading: true,
    forecastData: {}
  };

  componentDidMount() {
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
  }

  render() {
    const forecasts = this.state.forecastData.weathers;
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading ? (
          <div> Loding ... </div>
        ) : (
          <div>
            {forecasts.map((f) => (
              <div>
                <Forecast
                  key={f.time}
                  id={f.time}
                  time={f.time}
                  temp={f.temp}
                  condition={f.condition}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Home;
