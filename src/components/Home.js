import React, { Component } from 'react';

class Home extends Component {
  state = {
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

        this.setState({ forecastData: resData.data.getWeather });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h1>{}</h1>
      </div>
    );
  }
}
export default Home;
