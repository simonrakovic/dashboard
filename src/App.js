import React, { Component } from 'react';
import logo from './logo.svg';
import './app.css';
import { Col, Row, Container, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome'
import Clock from 'react-live-clock';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      cameraIsActive: false,
      displayedTab: 0,
    }
  }

  componentDidMount(){
    let eventSource = new EventSource('/api/camera/alarm/stream');
    eventSource.onmessage = message => {
      let data = JSON.parse(message.data)
      if(data.active)this.toggleCamera()

    };


    /*
    fetch('https://api.darksky.net/forecast/b69e234c7d2acaee2e547c057c23d3d5/37.8267,-122.4233')
      .then(results => {
        return results.json()
      })
      .then(data =>{
        console.log(data)
      })
    */

  }

  updateCameraImage(){
    setInterval(function(){
      this.camera.forceUpdate()
     }, 2000);
  }

  toggleCamera(){
    if(this.state.cameraIsActive)this.updateCameraImage()
    this.setState({cameraIsActive: this.state.cameraIsActive ? false:true})
  }

  changeTab(tabIndex){
    this.setState({displayedTab: tabIndex})
  }

  render() {
    let containerStyle = {
      width: "800px",
      height:"480px",
      overflow: "hidden"
    }

    let displayedTab = this.state.displayedTab
    let display = null

    if(displayedTab === 0){
      display = (
        <Col md={12}>
          <Row className="clock">
            <Clock format={'HH:mm:ss'} ticking={true} timezone={'Europe/Vienna'} />
          </Row>

        </Col>
      )
    }else if(displayedTab === 2){
      display = (
        <iframe  height="480" width="100%" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyBM7VLazAkhlF4ytelXMKNBMFc1EHD9TVI&origin=Drenov+Grič+174f,Slovenia&destination=Tbilisijska+57,Slovenia"></iframe>
      )
    }else if(displayedTab === 3){
      display = (
        <iframe height="480" width="100%" src="http://192.168.0.106:5000"></iframe>
      )
    }

    return (
      <Container style={containerStyle} fluid>
        <Row>
            {
              this.state.cameraIsActive ? (
                <img ref={(ref)=>this.camera = ref} width="800" height="480" src="http://192.168.0.220/ISAPI/Streaming/channels/101/picture?videoResolutionWidth=1920&videoResolutionHeight=1080" />
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
