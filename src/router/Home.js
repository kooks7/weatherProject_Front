import React from 'react';
import axios from 'axios';
import Forecast from '../components/Forecast';
import './Home.css';

// 'https://yts-proxy.now.sh/list_movies.json'

class Home extends React.Component {
  state = {
    isLoading: true,
    forecast: []
  };
  getData = async () => {
    const url = `http://localhost:4000/weather/busan`;
    const data = await axios.get(url);
    let imageUrl1 =
      'https://i.insider.com/5dc353fc3afd376a713d0902?width=1100&format=jpeg&auto=webp';
    // let imageUrl2 = `https://img.traveltriangle.com/blog/wp-content/uploads/2019/06/cover-for-places-to-visit-in-busan.jpg`;
    for (let d of data.data) {
      let time = new Date(d.time * 1000);
      console.log(time);
      d.time = `${time.getFullYear().toString()}년 ${(
        time.getMonth() + 1
      ).toString()}월 ${time.getDate().toString()}일 ${time.getHours()}:00 시`;
      // d.main.weather[0].main = d.main.weather[0].main;
    }

    for (let v of data.data) {
      v.imageUrl = imageUrl1;
    }
    this.setState({ forecast: data.data, isLoading: false });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { forecast } = this.state;
    return (
      <div className="forecast">
        {forecast.map((f) => {
          return (
            <Forecast
              key={f._id}
              id={f._id}
              time={f.time}
              temp={f.temp}
              feels_like={f.feels_like}
              image={f.imageUrl}
              weather={f.weather}
            />
          );
        })}
      </div>
    );
  }
}

export default Home;
