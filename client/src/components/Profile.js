import React, { Component } from 'react';
import { Container, Image, List } from 'semantic-ui-react';

class Profile extends Component {

  render() {
    return (
      <Container style={{margin: '30px'}}>

        <Image src={this.props.user} size='small' shape='circular' centered style={{margin: 'auto'}} />
      
        <Container style={{"textAlign": "center"}}>
          <List style={{margin: '10px'}}>
            <List.Item>
              <List.Header>My Dashboard</List.Header>
            </List.Item>
          </List>
        </Container>

      </Container>
    );
  }
}

export default Profile;
