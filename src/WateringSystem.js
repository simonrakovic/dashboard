import React, { Component } from 'react';

import { Col, Row, Container, Button, Label } from 'reactstrap';
import FontAwesome from 'react-fontawesome'

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'

import TimePicker from 'react-times';
// use material theme
import 'react-times/css/material/default.css';


class WateringSystem extends Component {
  constructor(){
    super()

    this.state ={
      showerIsActive: false,
      selectedTab: 0,

      time: 30,
      selectedShowerButton: 0,


      //////////timetable/////
      schedules: null,
      newSchedule: {
        showeId: "",
        start_time: '12:00',
        duration: 30,

      },

      //////////////
      time_picker_focus: false,
    }
  }

  getShowerStatus(){
    // TODO: call api for status
    this.setState({showerIsActive: true})
  }


  toggleTabs(index){
    this.setState({selectedTab: index})
  }

  toggleButtonSelect(index){
    this.setState({selectedShowerButton: index})
  }

  sendShowerRequest(){
    // TODO:  call api to start showering
    this.setState({showerIsActive: true})
  }

  cancleShower(){
    // TODO:  call api to stop showering
    this.setState({showerIsActive: false})
  }


  //////////////////TIMETABLE //////////////////
  getAllSchedules(){
    // TODO: call api for all schedules
    this.setState({schedules: null})
  }

  addSchedule(){
    let schedules = this.state.schedules
    schedules.push(this.state.newSchedule)
    this.setState({schedules: schedules})
  }

  onHourChange(){
    console.log("hi")
    this.setState({time_picker_focus: true})
  }

  onMinuteChange(){

    this.setState({time_picker_focus: false})
  }

  onTimeChange(time) {
    let newSchedule = this.state.newSchedule
    newSchedule.start_time = time
    this.setState({newSchedule: newSchedule})
  }

  handleChangeSlider(value){
    let newSchedule = this.state.newSchedule
    newSchedule.duration = value
    this.setState({newSchedule: newSchedule})
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
              this.state.showerIsActive ? (
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
          <Row className="schedule-container">

            <Col className="schedule-form" sm={6}>
              <Row className="shower-buttons">
                <Button>Leva zalivalka</Button>
                <Button>Desna zalivalka</Button>
              </Row>
              <Row className="time-picker">
                  <Label>Ura pričetka:</Label>
                  <TimePicker
                    focus={this.state.time_picker_focus}
                    onHourChange={()=>this.onHourChange()}
                    onMinuteChange={()=>this.onMinuteChange()}
                    onTimeChange={(time)=>this.onTimeChange(time)}
                    colorPalette="dark"
                    timeMode="24"
                    time={this.state.newSchedule.start_time}
                    value={this.state.newSchedule.start_time}
                  />

              </Row>
              <Row className="duration-slider">
                  <Label>Čas zalivanja:</Label>
                  <InputRange
                    step={5}
                    maxValue={60}
                    minValue={5}
                    value={this.state.newSchedule.duration}
                    name="duration"
                    onChange={(e) => this.handleChangeSlider(e)} />

              </Row>
              <Row className="button-schedule-save">
                <Button>Shrani</Button>
              </Row>
            </Col>
            <Col sm={6}>

            </Col>

          </Row>
        )
      }
      </Col>
    )
  }
}

export default WateringSystem;
