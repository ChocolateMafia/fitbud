import React, { Component } from 'react';
import { Card, Image, Transition, Container, Button, Icon, Rating, Divider } from 'semantic-ui-react';
var moment = require('moment');

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  componentDidMount () {
    this.setState({visible: true});
  }  

  handleApprove (id) {
    console.log('Accept requester id:', id);
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({userId: id, friendId: this.props.user.id})
    };
    fetch('/friends/accept', options)
      .then(response => {
        if (response.ok) {
          this.props.fetchFriends();
        }
      });        
  }

  handleReject (id) {
    console.log('Reject requester id:', id);
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({userId: id, friendId: this.props.user.id})
    };
    fetch('/friends/reject', options)
      .then(response => {
        if (response.ok) {
          this.props.fetchFriends();
        }
      }); 
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
            <Divider horizontal style={{marginTop: '20px', marginBottom: '10px'}}>New Friend Requests</Divider>
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
                    <Button basic color='red' onClick={() => this.handleReject(requester.id)}>Decline</Button>
                  </div>
                </Card.Content>
              </Card>          
            ))}
          </Card.Group>
          <Card.Group>
            <Divider horizontal style={{marginTop: '20px', marginBottom: '10px'}}>Friends</Divider>
            {friends.map(friend => (
              <Card>
                <Card.Content>
                  <Image floated='right' size='mini' src={friend.picture || randomPic} />
                  <Card.Header>
                    {friend.name}
                  </Card.Header>
                  <Card.Meta>
                    Join on {moment(friend.created).format('YYYY')} <Icon name={friend.gender}/> {friend.age}
                  </Card.Meta>
                  <Card.Description>
                    <Rating icon='star' defaultRating={friend.rating} maxRating={5} disabled/>
                  </Card.Description>
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