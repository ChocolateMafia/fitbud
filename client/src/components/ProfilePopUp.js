import React, { Component } from 'react';
import { Popup, Image, Button, Card, Icon, Rating } from 'semantic-ui-react';
var moment = require('moment');

class ProfilePopUp extends Component {
  constructor (props) {
    super(props);

    this.state = {
      requestSent: false,
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
    var {user, owner, component, on, position} = this.props;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];
    var statusMsg = {
      'pending': 'Pending',
      'accept': 'Friend',
      'reject': 'Send Friend Request'
    };
    var statusIcon = {
      'pending': 'wait',
      'accept': 'smile',
      'reject': 'add user'
    };

    console.log('Profile Props:::::::::', this.props);

    return (
      <Popup
        trigger={component}
        on={on || 'hover'}
        position={position || 'top left'}
        hoverable
      >
        <Card>
          <Card.Content>
            <Image floated='right' size='mini' src={owner.picture || randomPic} />
            <Card.Header>
              {owner.name}
            </Card.Header>
            <Card.Meta>
              <span className='date'>
                Join on {moment(owner.created).format('YYYY')} <Icon name={owner.gender}/> {owner.age}
              </span>
            </Card.Meta>
            <Card.Description>
              <Rating icon='star' defaultRating={owner.rating} maxRating={5} disabled/>
            </Card.Description>
          </Card.Content>
          <Card.Content extra textAlign='center'>
            {user && 
              <Button 
                disabled={owner.friendship === 'accept' || user.id === owner.id} 
                primary={owner.friendship !== 'accept'}
                positive={owner.friendship === 'accept'}
                onClick={this.sendFriendRequest}
              >
                {owner.friendship ? statusMsg[owner.friendship] : 'Send Friend Request'} &nbsp; <Icon name={statusIcon[owner.friendship] || 'add user'} />
              </Button>
            }
          </Card.Content>
        </Card>
      </Popup>
    );
  }
}

export default ProfilePopUp;