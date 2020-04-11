import React from 'react';
import axios from 'axios';
import Forecast from './Forecast';

class App extends React.Component {
  state = {
    forecast: [],
    city: 'undefined'
  };
  getData = async () => {
    const forecast = await axios.get(`http://localhost:4000/weather/busan`);

    // console.log(data.data.city.name);
    // for (let d of weatherData) {
    //   let time = new Date(d.dt * 1000);
    //   d.dt = `${time.getFullYear().toString()}년 ${(
    //     time.getMonth() + 1
    //   ).toString()}월 ${time.getDate().toString()}일 ${time.getHours()}:00 시`;
    //   d.main.temp = Math.floor(d.main.temp - 274.0);
    //   d.main.feels_like = Math.floor(d.main.feels_like - 274.0);
    //   // d.main.weather[0].main = d.main.weather[0].main;
    // }
    this.setState({ forecast: forecast.data, isLoading: false });
    console.log(this.state.forecast[0]);
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { forecast } = this.state;
    return (
      <div>
        {forecast.map((f) => {
          return (
            <Forecast
              _id={f.id}
              time={f.time}
              temp={f.temp}
              feels_like={f.feels_like}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
