import React, { Component } from 'react';

import { Col, Row, Container, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'

class WateringSystem extends Component {
  constructor(){
    super()

    this.state ={
      showrIsActive: false,
      selectedTab: 0,

      time: 30,
      selectedShowerButton: 0,

    }
  }

  getShowerStatus(){
    // TODO: call api for status
    this.setState({showrIsActive: true})
  }

  toggleTabs(index){
    this.setState({selectedTab: index})
  }

  toggleButtonSelect(index){
    this.setState({selectedShowerButton: index})
  }

  sendShowerRequest(){
    // TODO:  call api to start showering
    this.setState({showrIsActive: true})
  }

  cancleShower(){
    // TODO:  call api to stop showering
    this.setState({showrIsActive: false})
  }

  render(){
    return(
      <Col className="watering-container" sm={12}>
        <Row className="menu-buttons">
          <Button className={this.state.selectedTab === 0 ? "active":""} onClick={()=>this.toggleTabs(0)}><FontAwesome  name='tint' size='3x'/></Button>
          <Button className={this.state.selectedTab === 1 ? "active":""} onClick={()=>this.toggleTabs(1)}><FontAwesome  name='calendar' size='3x'/></Button>
        </Row>
        {
          this.state.selectedTab === 0 ? (
          <div>
            {
              this.state.showrIsActive ? (
                <Row className="button-stop-shower">
                  <Button onClick={()=>this.cancleShower()}><FontAwesome  name='times' size='3x'/></Button>
                </Row>
              ):(
                <span>
                  <Row className="choose-buttons">
                    <Col sm={2}></Col>
                    <Col sm={4}>
                      <Button className={this.state.selectedShowerButton === 0 ? "active":""} onClick={()=>this.toggleButtonSelect(0)}>Leva zalivalka</Button>
                    </Col>
                    <Col sm={4}>
                      <Button className={this.state.selectedShowerButton === 1 ? "active":""} onClick={()=>this.toggleButtonSelect(1)} style={{"float":"right"}}>Desna zalivalka</Button>
                    </Col>
                    <Col sm={2}></Col>
                  </Row>
                  <Row className="time-input">
                    <Col sm={2}></Col>
                    <Col sm={8}>
                      <InputRange
                        step={5}
                        maxValue={60}
                        minValue={5}
                        value={this.state.time}
                        onChange={time => this.setState({ time })} />
                    </Col>
                  </Row>
                  <Row className="send-button">
                    <Col sm={2}></Col>
                    <Col sm={8}>
                      <Button onClick={()=>this.sendShowerRequest()}><FontAwesome  name='shower' size='3x'/></Button>
                    </Col>
                    <Col sm={2}></Col>

                  </Row>
                </span>
              )
            }
          </div>
        ):(
          <Row></Row>
        )
      }
      </Col>
    )
  }
}

export default WateringSystem;
