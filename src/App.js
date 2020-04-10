import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {
    isLoading: true,
    forecast: {}
  };
  getData = async () => {
    let city = 'busan';
    const data = await axios.get(`http://localhost:4000/weather/${city}`);

    console.log(data);
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
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { isLoading } = this.state;
    return <div>{isLoading ? 'Loading..' : 'We are Ready'}</div>;
  }
}

export default App;
