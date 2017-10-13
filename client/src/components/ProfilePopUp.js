import React, { Component } from 'react';
import { Popup, Image, Button, Card, Icon, Rating } from 'semantic-ui-react';
var moment = require('moment');

class ProfilePopUp extends Component {
  constructor (props) {
    super(props);

    this.state = {
      friendship: ''
    };
  
    this.sendFriendRequest = this.sendFriendRequest.bind(this);
    this.fetchFriendshipStatus = this.fetchFriendshipStatus.bind(this);
  }

  fetchFriendshipStatus () {
    
  }

  sendFriendRequest() {

  }

  render () {
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];    
    console.log('Profile Props:::::::::', this.props);

    return (
      <Popup
        trigger={this.props.component}
        on={this.props.on || 'hover'}
        position={this.props.position || 'top left'}
      >
        <Card>
          <Card.Content>
            <Image floated='right' size='mini' src={this.props.owner.picture || randomPic} />
            <Card.Header>
              {this.props.owner.name}
            </Card.Header>
            <Card.Meta>
              <span className='date'>
                Join on {moment(this.props.owner.created).format('YYYY')} <Icon name={this.props.owner.gender}/> {this.props.owner.age}
              </span>
            </Card.Meta>
            <Card.Description>
              <Rating icon='star' defaultRating={this.props.owner.rating} maxRating={5} disabled/>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='owner' />
              22 Friends
            </a>
            {this.props.user && <Button disabled={this.state.requestSent || listing.status !== null || user.id === listing.ownerId} primary onClick={this.sendFriendRequest}>
              { this.state.requestSent || listing.status ? 'Pending' : 'Send Friend Request' } <Icon name='right chevron' />
            </Button>}
          </Card.Content>
        </Card>
      </Popup>
    );
  }
}

export default ProfilePopUp;