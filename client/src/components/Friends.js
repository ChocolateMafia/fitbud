import React, { Component } from 'react';
import { Card, Image, Transition, Container } from 'semantic-ui-react';

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

  }

  componentDidMount () {
    this.setState({visible: true});
  }  

  render () {
    var { selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

    //console.log('props from dashboard to requests', this.props);
    return (
      <Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>

        </Container>
      </Transition>
    );
  }
}

export default Friends;