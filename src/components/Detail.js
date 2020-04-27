import React, { Component } from 'react';
import styled from 'styled-components';

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
    resData: Array
  };

  getClothes = () => {
    const graphqlQuery = {
      query: `
        query getClotesData($temp: Int!){
            getClothes(temp: $temp) {
              name
              type
              temp
              level
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
        console.log(this.state.resData.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    this.getClothes();
  }

  render() {
    if (!this.state.isLoading) {
    }
    const { time, feels_like, onClose } = this.props;
    const { isLoading } = this.state;
    console.log(typeof feels_like);
    return (
      <div>
        {isLoading ? (
          <div>
            <Modal> Loding ...</Modal>
          </div>
        ) : (
          <Modal>
            <Content>
              <h3>hi</h3>
              <h4>{time}</h4>
              <h4>{feels_like}</h4>
            </Content>
            {this.state.resData.data.getClothes.map((d) => (
              <Clothes>
                <ClothesItem>{d.name}</ClothesItem>
              </Clothes>
            ))}
            <button onClick={onClose}>닫기</button>
          </Modal>
        )}
      </div>
    );
  }
}
const Modal = styled.div`
  background: rgba(0, 0, 0, 0.25);
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Content = styled.div`
  background: white;
  color: black;
  padding: 1rem;
  width: 400px;
  height: auto;
`;

const Clothes = styled.div`
  background: white;
  color: black;
  padding: 1rem;
  width: 400px;
  height: auto;
`;
const ClothesItem = styled.p``;

export default Detail;
