import React, { Component } from 'react';
import styled from 'styled-components';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from './TabPanel';
import Socket from 'socket.io-client';

class Detail extends Component {
  state = {
    isLoading: true,
    resData: Array,
    value: 0,
    city: this.props.city,
    time: () => {
      const timeStamp = new Date();
      const year = timeStamp.getFullYear();
      const month = timeStamp.getMonth() + 1;
      const date = timeStamp.getDate();
      const time = year.toString() + month.toString() + date.toString();
      return time;
    }
  };

  getClothes = () => {
    const graphqlQuery = {
      query: `
        query getClotesData($temp: Float!, $time: String!, $city: String!){
            getClothes(temp: $temp, time: $time, city: $city) {
              outer{
                _id
                name
                like
                unlike
              }
              top{
                _id
                name
                like
                unlike
              }
              
            }
          }      
    `,
      variables: {
        temp: this.props.feels_like,
        time: new Date(),
        city: this.props.city
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

  updateLike = (res) => {
    const {
      resData: {
        data: { getClothes }
      }
    } = this.state;
    for (let i = 0; i < getClothes[res.type].length; i++) {
      if (getClothes[res.type][i]._id === res.updateResult) {
        this.setState((prevState) => {
          const updateData = prevState.resData;
          console.log(updateData);
          updateData.data.getClothes[res.type][i][res.action]++;
          return { resData: updateData };
        });
      }
    }
  };

  componentDidMount = () => {
    this.getClothes();
    // 배포할때 포트 바꿔주기
    const socket = Socket('http://localhost:4000');
    // update 대기
    socket.on(`${this.state.city}-${this.state.time()}`, (res) => {
      console.log(res.action);
      this.updateLike(res);
    });
  };

  // 좋아요 구현

  clickLike = (type, liked, _id, e) => {
    // 도시 날짜 옷 타입 식별자 만들기
    // 로컬스토리지에 있는지 체크
    // if (localStorage.getItem(`${city}-${time}-${type}`) === 'true') {
    // alert('이미 좋아요를 눌렀습니다.');
    // } else {
    // 로컬스토리지에 like 한번만 하게 정보 저장하기
    const { city, time } = this.state;
    localStorage.setItem(`${city}-${time}-${type}`, 'true');
    // socket.io로 좋아요 늘리기
    const socket = Socket.connect('http://localhost:4000');

    socket.emit('liked', {
      action: liked,
      data: `${city}-${time()}-${type}-${_id}_${liked}`
    });
  };

  render() {
    const { time, feels_like, onClose, city, country } = this.props;
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
                <h3>{country} ,</h3>
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
                    <Tab label="Outer" {...this.a11yProps(0)} />
                    <Tab label="Top" {...this.a11yProps(1)} />
                    <Tab label="Bottom" {...this.a11yProps(2)} />
                    <Tab label="Acc" {...this.a11yProps(3)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                  <ClothesItemContainer>
                    {this.state.resData.data.getClothes.outer.map((d) => {
                      return (
                        <ClothesItem key={d._id}>
                          {d.name}- {d.like} - {d.unlike}
                          <button
                            onClick={(e) =>
                              this.clickLike('outer', 'like', d._id, e)
                            }
                          >
                            좋아요
                          </button>
                          <button
                            onClick={(e) =>
                              this.clickLike('outer', 'unlike', d._id, e)
                            }
                          >
                            별루
                          </button>
                        </ClothesItem>
                      );
                    })}
                  </ClothesItemContainer>
                </TabPanel>

                <TabPanel value={this.state.value} index={1}>
                  <ClothesItemContainer>
                    {this.state.resData.data.getClothes.top.map((d) => {
                      return (
                        <ClothesItem key={d._id}>
                          {d.name}-{d.like} - {d.unlike}
                          <button
                            onClick={(e) =>
                              this.clickLike('top', 'like', d._id, e)
                            }
                          >
                            좋아요
                          </button>
                          <button
                            onClick={(e) =>
                              this.clickLike('top', 'unlike', d._id, e)
                            }
                          >
                            별루
                          </button>
                        </ClothesItem>
                      );
                    })}
                  </ClothesItemContainer>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  <ClothesItemContainer>
                    {/* {this.state.resData.data.getClothes.outer.map((d) => {
                      return <ClothesItem>{d.name}</ClothesItem>;
                    })} */}
                  </ClothesItemContainer>
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                  <ClothesItemContainer>
                    {/* {this.state.resData.data.getClothes.outer.map((d) => {
                      return <ClothesItem>{d.name}</ClothesItem>;
                    })} */}
                  </ClothesItemContainer>
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
  /* display: flex; */
  /* flex-direction: column; */
  padding: 2em;
  max-width: 50%;
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
const ClothesItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 20rem;
  max-height: 30rem;
  justify-content: space-around;
  align-content: space-around;
  margin-left: 2rem;
`;

const ClothesItem = styled.p`
  padding: 10px;
  margin: 10px;
  border: 0.5px solid rgba(200, 200, 200, 0.9);
  border-radius: 3px;
`;

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
