import React, { Component } from 'react';
import styled from 'styled-components';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from './TabPanel';

// const Detail = ({ time, feels_like, onClose }) => {
//   const graphqlQuery = {
//     query: `
//             {
//                 getWeather(latitude:"37.4999", longitude:"127.0374") {
//                     city
//                 gu
//                 weathers{
//                   time
//                   temp
//                   feels_like
//                   condition
//                 }
//               }
//             }
//                 `
//   };

//   fetch('http://localhost:4000/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(graphqlQuery)
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((resData) => {
//       if (resData.errors) {
//         throw new Error('에러');
//       }
//       console.log(resData);
//       return (
//         <Modal>
//           <Content>
//             <h3>hi</h3>
//             <h4>{time}</h4>
//             <h4>{feels_like}</h4>
//             <button onClick={onClose}>닫기</button>
//           </Content>
//         </Modal>
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// 1587999600

class Detail extends Component {
  state = {
    isLoading: true,
    resData: Array,
    value: 0
  };

  getClothes = () => {
    const graphqlQuery = {
      query: `
        query getClotesData($temp: Float!){
            getClothes(temp: $temp) {
              outer{
                name
              }
              
            }
          }      
    `,
      variables: {
        temp: this.props.feels_like
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
          isLoading: false,
          resData: resData
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  };
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  componentDidMount = () => {
    this.getClothes();
  };

  render() {
    const { time, feels_like, onClose, city, gu } = this.props;
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading ? (
          <div>
            <Modal> Loding ...</Modal>
          </div>
        ) : (
          <>
            <ModalContainer onClick={onClose}></ModalContainer>
            <Modal>
              <Content>
                <h4>{time}</h4>
                <h3>{gu} ,</h3>
                <h3>{city}의 현재 날씨</h3>
                <h4> 체감온도: {feels_like}</h4>
              </Content>

              <Clothes>
                <AppBar position="static">
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="Item One" {...this.a11yProps(0)} />
                    <Tab label="Item Two" {...this.a11yProps(1)} />
                    <Tab label="Item Three" {...this.a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                  {this.state.resData.data.getClothes.outer.map((d) => {
                    return <p>{d.name}</p>;
                  })}
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  {this.state.resData.data.getClothes.outer.map((d) => {
                    return <p>{d.name}</p>;
                  })}
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  {this.state.resData.data.getClothes.outer.map((d) => {
                    return <p>{d.name}</p>;
                  })}
                </TabPanel>
              </Clothes>
              <ModalCloseBtn onClick={onClose}>Close</ModalCloseBtn>
            </Modal>
          </>
        )}
      </div>
    );
  }
}
const ModalContainer = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;
const Modal = styled.div`
  z-index: 1;
  /* background: rgba(0, 0, 0, 0.25); */
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  padding: 2em;
  min-width: 20em;
  max-width: 70%;
  max-height: 60%;
  color: black;
  background-color: #fff;
  border-radius: 1em;
  transform: translate(-50%, -50%);
  outline: transparent;

  /* width: 50%; */
`;
const Content = styled.div`
  display: flex;
  margin-bottom: 3px;
  border-bottom: 0.5px solid rgba(200, 200, 200, 0.9);
`;

const Clothes = styled.div`
  /* display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  max-height: 50%; */
`;
const ClothesItem = styled.p``;

const ModalCloseBtn = styled.button`
  position: relative;
  bottom: -80px;
  font-size: 1em;
  margin: 1em;
  padding: 5px;
  border-radius: 3px;
  background-color: rgba(051, 051, 051, 0.5);
  color: rgba(220, 220, 220, 1);
  border: 0px;
`;

export default Detail;
