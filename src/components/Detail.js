import React, { Component } from 'react';
import styled from 'styled-components';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from './TabPanel';
import PropTypes from 'prop-types';
import Socket from 'socket.io-client';

class Detail extends Component {
  state = {
    isLoading: true,
    resData: Array,
    value: 0,
    getTime: () => {
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
              bottom{
                _id
                name
                like
                unlike
              }
              acc{
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

    fetch('http://https://weather-graphql-api.herokuapp.com/graphql', {
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
          // 한번 누른거면
          if (res.action === 'like') {
            if (!res.alreadyClicked) {
              updateData.data.getClothes[res.type][i][res.action]++;
            } else if (res.alreadyClicked) {
              updateData.data.getClothes[res.type][i][res.action]--;
            }
            return { resData: updateData };
            // 누른적 있으면
          } else if (res.action === 'unlike') {
            if (!res.alreadyClicked) {
              updateData.data.getClothes[res.type][i][res.action]++;
            } else if (res.alreadyClicked) {
              updateData.data.getClothes[res.type][i][res.action]--;
            }
            return { resData: updateData };
          }
        });
      }
    }
  };

  componentDidMount = () => {
    this.getClothes();
    // 배포할때 포트 바꿔주기
    const socket = Socket('http://https://weather-graphql-api.herokuapp.com');
    // update 대기
    socket.on(`${this.props.city}-${this.state.getTime()}`, (res) => {
      this.updateLike(res);
    });
  };

  // 좋아요 구현

  clickLike = (type, liked, _id, e) => {
    const { getTime } = this.state;
    const { city } = this.props;
    const socket = Socket.connect(
      'http://https://weather-graphql-api.herokuapp.com'
    );
    // 도시 날짜 옷 타입 식별자 만들기
    // 로컬스토리지에 있는지 체크
    // liked : 1. like 이전에 좋아요 누른적 없음 2. unlike 이전에 별로에요 누른적 없음
    // 3. alreadyLike 이전에 좋아요 누른적 있음 해제 3. alreadUnlike

    // 특정 아이템 누른적 있으면 좋아요 해제 하기
    if (
      localStorage.getItem(`${city}-${getTime()}-${_id}-${liked}`) === 'true'
    ) {
      // 좋아요 감수시키고,
      socket.emit('liked', {
        action: liked,
        data: `${city}-${getTime()}-${type}-${_id}_${liked}`,
        alreadyClicked: true
      });
      // 좋아요 이력 지우기
      localStorage.removeItem(`${city}-${getTime()}-${_id}-${liked}`);
      localStorage.removeItem(`${city}-${getTime()}-${type}`);
      return;
    } else if (
      localStorage.getItem(`${city}-${getTime()}-${type}`) === 'true'
    ) {
      alert(`${type}에 이미 좋아요를 눌렀습니다.`);
      return;
    }

    // 로컬스토리지에 like 한번만 하게 정보 저장하기
    // 특정 아이템 누른적 있는지
    localStorage.setItem(`${city}-${getTime()}-${_id}-${liked}`, 'true');
    // 타입 누른적 있는지
    localStorage.setItem(`${city}-${getTime()}-${type}`, 'true');
    // socket.io로 좋아요 늘리기

    socket.emit('liked', {
      action: liked,
      data: `${city}-${getTime()}-${type}-${_id}_${liked}`,
      alreadyClicked: false
    });
  };

  render() {
    const { time, feels_like, onClose, city, country } = this.props;
    const { isLoading, getTime } = this.state;
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
                <h4>{time} </h4>
                <h3>{country} ,</h3>
                <h3>{city} 의 출격 명령</h3>
                <h4> 체감온도: {feels_like}°C</h4>
              </Content>

              <>
                <AppBar position="static">
                  <Tabs value={this.state.value} onChange={this.handleChange}>
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
                          <ClothesName>{d.name}</ClothesName>
                          <ClothesLikeDiv>
                            <ClothesLike>
                              좋아요
                              <ClothesLikeNum>{d.like}명</ClothesLikeNum>
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('outer', 'like', d._id, e)
                                }
                              >
                                {' '}
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-like`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>
                            <ClothesLike>
                              별로에요
                              <ClothesLikeNum>{d.unlike}명</ClothesLikeNum>
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('outer', 'unlike', d._id, e)
                                }
                              >
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-unlike`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>{' '}
                          </ClothesLikeDiv>
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
                          <ClothesName>{d.name}</ClothesName>
                          <ClothesLikeDiv>
                            <ClothesLike>
                              좋아요:{d.like}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('top', 'like', d._id, e)
                                }
                              >
                                {' '}
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-like`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>
                            <ClothesLike>
                              별로에요:{d.unlike}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('top', 'unlike', d._id, e)
                                }
                              >
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-unlike`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>{' '}
                          </ClothesLikeDiv>
                        </ClothesItem>
                      );
                    })}
                  </ClothesItemContainer>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  <ClothesItemContainer>
                    {this.state.resData.data.getClothes.bottom.map((d) => {
                      return (
                        <ClothesItem key={d._id}>
                          <ClothesName>{d.name}</ClothesName>
                          <ClothesLikeDiv>
                            <ClothesLike>
                              좋아요:{d.like}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('bottom', 'like', d._id, e)
                                }
                              >
                                {' '}
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-like`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>
                            <ClothesLike>
                              별로에요:{d.unlike}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('bottom', 'unlike', d._id, e)
                                }
                              >
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-unlike`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>{' '}
                          </ClothesLikeDiv>
                        </ClothesItem>
                      );
                    })}
                  </ClothesItemContainer>
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                  <ClothesItemContainer>
                    {this.state.resData.data.getClothes.acc.map((d) => {
                      return (
                        <ClothesItem key={d._id}>
                          <ClothesName>{d.name}</ClothesName>
                          <ClothesLikeDiv>
                            <ClothesLike>
                              좋아요:{d.like}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('acc', 'like', d._id, e)
                                }
                              >
                                {' '}
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-like`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>
                            <ClothesLike>
                              별로에요:{d.unlike}
                              <ClothesLikeBtn
                                onClick={(e) =>
                                  this.clickLike('acc', 'unlike', d._id, e)
                                }
                              >
                                {localStorage.getItem(
                                  `${city}-${getTime()}-${d._id}-unlike`
                                )
                                  ? '★'
                                  : '☆'}
                              </ClothesLikeBtn>
                            </ClothesLike>{' '}
                          </ClothesLikeDiv>
                        </ClothesItem>
                      );
                    })}
                  </ClothesItemContainer>
                </TabPanel>
              </>
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
  width: 85rem;
  height: 43rem;
  color: black;
  background-color: #fff;
  border-radius: 1em;
  transform: translate(-50%, -50%);
  outline: transparent;
`;
const Content = styled.div`
  display: flex;
  * {
    margin: 10px 5px 10px;
  }
  border-bottom: 0.5px solid rgba(200, 200, 200, 0.9);
`;

const ClothesItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  width: 83rem;
  height: 30rem;
  justify-content: flex-start;
  align-content: space-around;
`;

const ClothesItem = styled.div`
  padding: 10px;
  margin: 10px;
  border: 0.5px solid rgba(200, 200, 200, 0.9);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  width: 9rem;
  height: 9.5rem;
  box-shadow: 1px 1px 0px 0px rgba(200, 200, 200, 0.5);
`;

const ClothesName = styled.div`
  font-size: 20px;
  font-weight: 600;
  size: 20px;
  text-align: center;
  margin-bottom: auto;
`;
const ClothesLikeDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
const ClothesLike = styled.div`
  font-size: 12px;
  display: flex;
  align-items: baseline;
`;

const ClothesLikeNum = styled.p`
  font-weight: 700;
`;

const ClothesLikeBtn = styled.button`
  border: none;
  background: none;
  font-size: 17px;
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

Detail.propType = {
  country: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  feels_like: PropTypes.number.isRequired
};

export default Detail;
