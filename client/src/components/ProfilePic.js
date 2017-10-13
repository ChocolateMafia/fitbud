import React, { Component } from 'react';
import { Container, Image, List } from 'semantic-ui-react';

class ProfilePic extends Component {
  render() {
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var userPic = '/' + images[Math.floor(Math.random() * images.length)];

    return (
      console.log(this.props),
      <Container style={{margin: '30px'}}>

        <Container style={{margin: '30px'}}>
          <Image src={(this.props.user && this.props.user.picture) ? this.props.user.picture : userPic} size='small' shape='circular' centered style={{margin: 'auto'}} />
        
          <Container style={{'textAlign': 'center'}}>
            <List style={{margin: '10px'}}>
              <List.Item>
                <List.Header>My Dashboard</List.Header>
              </List.Item>
            </List>
          </Container>
        </Container>

        <Container style={{margin: '30px'}}>


        </Container>
                
      </Container>
    );
  }
}

export default ProfilePic;
