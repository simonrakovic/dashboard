import React, { Component } from 'react';

import './app.css';
import { Col, Row, Container, Button } from 'reactstrap';
import WateringSystem from './WateringSystem'
import FontAwesome from 'react-fontawesome'
import Clock from 'react-live-clock';
import axios from 'axios'
import moment from 'moment'


const weatherIconMap = {
  "clear-day":"wi wi-day-sunny",
  "clear-night":"wi wi-night-clear",
  rain: "wi wi-rain",
  snow: "wi wi-snow",
  sleet: "wi wi-sleet",
  wind: "wi wi-windy",
  fog: "wi wi-fog",
  cloudy: "wi wi-cloud",
  "partly-cloudy-day": "wi wi-day-cloudy",
  "partly-cloudy-night": "wi wi-night-alt-cloudy"
}

const CAMERA_URL = "http://192.168.0.220/ISAPI/Streaming/channels/101/picture?videoResolutionWidth=1920&videoResolutionHeight=1080"
const GOOGLE_MAP_URL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBM7VLazAkhlF4ytelXMKNBMFc1EHD9TVI&origin=Drenov+Gric+174f,Slovenia&destination=tbilisijska+57,Slovenia"

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      cameraIsActive: false,
      displayedTab: 0,
      refreshCameraFunId: null,

      weather: null
    }
  }

  componentDidMount(){
    let eventSource = new EventSource('/api/camera/alarm/stream');
    eventSource.onmessage = message => {
      let data = JSON.parse(message.data)
      if(data.active && !this.state.cameraIsActive)this.toggleCamera()

    };

    this.getWeatherData()
    setInterval(()=>{this.getWeatherData()},300000)
    //////////////////////////////////////////

  }

  getWeatherData(){
    axios.get('/api/weather')
	  .then( (response) => {
      this.setState({weather: response.data})
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  updateCameraImage(ref){

    this._camera.src = CAMERA_URL+"?t="+new Date().getTime();
    console.log(this._camera)
  }

  toggleCamera(){
    let cameraIsActive = this.state.cameraIsActive ? false:true
    let funId = this.state.refreshCameraFunId
    //reload img on every 2s
    if(cameraIsActive)funId = setInterval(()=>{this.updateCameraImage()},2000)
    //on view changed, clear refresh function
    else if(funId)clearInterval(funId)
    setTimeout(()=>{
      this.setState({cameraIsActive:false})
      clearInterval(funId)
    },20000);
    this.setState({cameraIsActive: cameraIsActive, refreshCameraFunId: funId})
  }

  changeTab(tabIndex){
    this.setState({displayedTab: tabIndex})
  }

  render() {
    let containerStyle = {
      width: "800px",
      height:"480px",

    }

    let displayedTab = this.state.displayedTab
    let display = null

    if(displayedTab === 0 && this.state.weather){
      display = (
        <Col md={12}>
          <Row className="clock">
            <Clock format={'HH:mm:ss'} ticking={true} timezone={'Europe/Vienna'} />
          </Row>

            <Row>

              <Col md={12}>
                <div  className="current-weather">
                  <div className="weather-icon">
                    {
                      Object.keys(weatherIconMap).map((key, i)=>{
                        if(key === this.state.weather.currently.icon){
                          return(
                            <i key={i} className={weatherIconMap[key]}></i>
                          )
                        }
                      })
                    }
                  </div>
                  <div className="current-temp">
                    {
                      Math.floor((this.state.weather.currently.temperature-32)/(9/5))
                    }&deg;C
                  </div>
                </div>

              </Col>
          </Row>

          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Row className="current-additional-info">
                <Col md={4}>
                  <div className="data">
                    <i className="wi wi-humidity"></i>
                    <br/>
                    {
                      Math.ceil(this.state.weather.currently.humidity*100)
                    } %
                  </div>
                </Col>
                <Col md={4}>
                  <div className="data">
                    <i className="wi wi-barometer"></i>
                    <br/>
                    {
                      Math.ceil(this.state.weather.currently.pressure)
                    } mBar
                  </div>
                </Col>
                <Col md={4}>
                  <div className="data">
                    <i className="wi wi-strong-wind"></i>
                    <br/>
                    {
                      Math.ceil(this.state.weather.currently.windSpeed*1.609344)
                    } km/h
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            {
              this.state.weather.hourly.data.map((data, i)=>{
                let timestamp = new Date(parseInt(data.time)*1000)
                if( moment(timestamp).isSameOrAfter(Date.now()) && moment(timestamp).isSameOrBefore(moment(Date.now()).add(1,'day')) && moment(timestamp).hour()%2===0){
                  return(
                    <Col className="hourly-weather-data" md={1} key={i}>
                      <Row className="hourly-weather-data-column">
                        <div className="hour">{moment(timestamp).format('HH:mm')}</div>
                        <div className="weather-icon">
                          {
                            Object.keys(weatherIconMap).map((key, i)=>{
                              if(key === data.icon){
                                return(
                                  <i key={i} className={weatherIconMap[key]}></i>
                                )
                              }
                            })
                          }
                        </div>
                        <div className="temperature">
                          {
                            Math.floor((data.temperature-32)/(9/5))
                          }&deg;C
                        </div>
                      </Row>
                    </Col>
                  )
                }
              })
            }
          </Row>
        </Col>
      )
    }else if(displayedTab === 2){
      display = (
        <iframe  height="480" width="100%" src={GOOGLE_MAP_URL}></iframe>
      )
    }else if(displayedTab === 3){
      display = (
        <WateringSystem />
      )
    }

    return (
      <Container style={containerStyle} fluid>

        <Row>
            {
              this.state.cameraIsActive ? (
                <img ref={(ref)=>this._camera = ref} width="800" height="480" src="http://192.168.0.220/ISAPI/Streaming/channels/101/picture?videoResolutionWidth=1920&videoResolutionHeight=1080" />
              ):(
                <Col md={12}>
                  <Row>
                    <Col md={2} className="navigation-bar">
                      <Row>
                        <Button onClick={()=>this.changeTab(0)}>
                          <FontAwesome  name='home' size='3x'/>
                        </Button>
                      </Row>
                      <Row>
                        <Button onClick={()=>this.changeTab(1)}>
                          <FontAwesome  name='sun' size='3x'/>
                        </Button>
                      </Row>
                      <Row>
                        <Button onClick={()=>this.changeTab(2)}>
                          <FontAwesome  name='car' size='3x'/>
                        </Button>
                      </Row>
                      <Row>
                        <Button onClick={()=>this.changeTab(3)}>
                          <FontAwesome  name='tint' size='3x'/>
                        </Button>
                      </Row>
                    </Col>
                    <Col md={10}>
                      <Row>
                        {display}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              )
            }
        </Row>
      </Container>
    );
  }
}


export default App;
