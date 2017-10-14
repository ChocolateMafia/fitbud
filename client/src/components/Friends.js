import React, { Component } from 'react';
import { Card, Image, Transition, Container, Button, Icon, Rating } from 'semantic-ui-react';
var moment = require('moment');

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleApprove = this.handleApprove.bind();
    this.handleReject = this.handleReject.bind();
  }

  componentDidMount () {
    this.setState({visible: true});
  }  

  handleApprove (id) {
    console.log('Approve requester id:', id);

  }

  handleReject (id) {
    console.log('Reject requester id:', id);

  }

  render () {
    var { user, friends, requesters } = this.props;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];

    //console.log('props from dashboard to requests', this.props);
    return (
      <Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group>
            {requesters.map(requester => (
              <Card>
                <Card.Content>
                  <Image floated='right' size='mini' src={requester.picture || randomPic} />
                  <Card.Header>
                    {requester.name}
                  </Card.Header>
                  <Card.Meta>
                    Join on {moment(requester.created).format('YYYY')} <Icon name={requester.gender}/> {requester.age}
                  </Card.Meta>
                  <Card.Description>
                    <Rating icon='star' defaultRating={requester.rating} maxRating={5} disabled/>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => this.handleApprove(requester.id)}>Approve</Button>
                    <Button basic color='red' onClick={() => this.handleApprove(requester.id)}>Decline</Button>
                  </div>
                </Card.Content>
              </Card>          
            ))}
          </Card.Group>
        </Container>
      </Transition>
    );
  }
}

export default Friends;