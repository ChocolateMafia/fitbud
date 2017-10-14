import React, { Component } from 'react';
import { Popup, Image, Button, Card, Icon, Rating } from 'semantic-ui-react';
var moment = require('moment');

class ProfilePopUp extends Component {
  constructor (props) {
    super(props);

    this.state = {
      friendship: this.props.owner.friendship
    };
  
    this.sendFriendRequest = this.sendFriendRequest.bind(this);
  }

  sendFriendRequest() {
    var formData = {
      userId: this.props.user.id,
      friendId: this.props.owner.id
    };

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    };

    fetch('/friends', options)
      .then(response => {
        if (response.ok) {
          this.setState({
            friendship: 'pending'
          });
        }
      });    
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
                disabled={this.state.friendship === 'accept' || this.state.friendship === 'pending' || user.id === owner.id} 
                primary={this.state.friendship !== 'accept'}
                positive={this.state.friendship === 'accept'}
                onClick={this.sendFriendRequest}
              >
                {this.state.friendship ? statusMsg[this.state.friendship] : 'Send Friend Request'} &nbsp; <Icon name={statusIcon[this.state.friendship] || 'add user'} />
              </Button>
            }
          </Card.Content>
        </Card>
      </Popup>
    );
  }
}

export default ProfilePopUp;