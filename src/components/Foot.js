import React, { Component } from 'react';
import styled from 'styled-components';
import ModalPortal from '../components/ModalPortal';
import { isAlphanumeric } from 'validator';

class Foot extends Component {
  state = {
    keyword: '',
    searchedCity: [],
    modalFooter: false
  };

  // 1.함수 키워드 변경 감지 하기
  keywordChange = (e) => {
    let searchStr = e.target.value;
    this.setState({ keyword: searchStr });
  };

  // 2. 폼 제출해서 검색 하기
  citySearching = (e) => {
    e.preventDefault();
    if (!isAlphanumeric(this.state.keyword)) {
      alert('특수문자를 빼주세요.');
      return;
    }
    const graphqlQuery = {
      query: `
      query getSearchingCity($city: String! )
            {
                getCityId(city: $city) {
                   name
                   country
                   coord{
                    lat
                    lon
                  }
                }
            }      
                `,
      variables: {
        city: this.state.keyword
      }
    };
    if (isAlphanumeric(this.state.keyword))
      fetch('https://weather-graphql-api.herokuapp.com/graphql', {
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
          const {
            data: { getCityId }
          } = resData;
          if (!getCityId) {
            alert('검색한 도시가 없습니다.');
            return;
          }
          this.setState({
            searchedCity: getCityId
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };
  // modal동작
  handleOpenModal = () => {
    this.setState({
      modalFooter: true
    });
  };
  handleCloseModal = () => {
    this.setState({
      modalFooter: false,
      searchedCity: ''
    });
  };

  // 3. 클릭하면 도시 변경하기
  selectCity = (d, e) => {
    this.setState({
      searchedCity: []
    });
    this.props.getWeather(d.coord.lat.toString(), d.coord.lon.toString());
    alert('위치가 변경되었습니다!');
  };
  render() {
    const { searchedCity } = this.state;
    return (
      <Footer>
        {/* <Nav>네비게이션</Nav> */}

        <SearchingContainer>
          <h1 onClick={this.handleOpenModal}>Search</h1>
          {this.state.modalFooter && (
            <ModalPortal>
              <SearchingBar onSubmit={this.citySearching}>
                <input type="text" onChange={this.keywordChange}></input>
                <Btn type="submit">search</Btn>
                <Btn onClick={this.handleCloseModal}>Close</Btn>
              </SearchingBar>
              <div>
                {searchedCity[0] ? (
                  <div>
                    <SearchList>
                      {searchedCity.map((d) => {
                        return (
                          <li key={d.name}>
                            <SearchRes onClick={(e) => this.selectCity(d, e)}>
                              {d.name}-{d.country}
                            </SearchRes>
                          </li>
                        );
                      })}
                    </SearchList>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </ModalPortal>
          )}
        </SearchingContainer>
        <AboutContainer>
          <h1>About</h1>
        </AboutContainer>
      </Footer>
    );
  }
}

const Footer = styled.div`
  position: fixed;
  color: black;
  background-color: #f3f4f7;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 60px;
  padding: 15px 0;
  text-align: center;
  margin-top: auto;
  flex: 1;
  display: flex;
  align-items: center;
`;

const SearchingContainer = styled.div`
  display: flex;
  margin: 0rem auto 0 5rem;
`;

const SearchingBar = styled.form`
  font-size: 1rem;
`;

const SearchRes = styled.a`
  font-size: 0.8rem;

  & :hover {
    color: yellow;
  }
`;
const SearchList = styled.ul`
  position: sticky;
  color: black;
  background-color: rgb(240, 240, 255);
  font-weight: 100;
  display: inline-block;
  li {
    border-radius: 10px;
    font-weight: 200;
    list-style: circle;
    padding: 5px 60px 5px 10px;
    border-bottom: 0.5px solid rgba(200, 200, 200, 0.7);
  }
`;

const AboutContainer = styled.div`
  margin-left: auto;
  margin-right: 5rem;
`;

const Btn = styled.button`
  font-size: 0.9em;
  margin: 0.1rem;
  padding: 0.25em 1em;
  border-radius: 3px;
  background-color: rgba(051, 051, 051, 0.5);
  color: rgba(220, 220, 220, 1);
  border: 0px;
`;

export default Foot;
