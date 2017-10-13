import React, { Component } from 'react';
import { Popup, Image, Button, Card, Icon } from 'semantic-ui-react';


class ProfilePopUp extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    console.log(this.props);

    return (
      <Popup
        trigger={this.props.component}
        on={this.props.on || 'hover'}
        position={this.props.position || 'top left'}
      >
        <Card>
          <Image floated='right' size='mini' src={this.props.user.picture} />
          <Card.Content>
            <Card.Header>
              {this.props.user.name}
            </Card.Header>
            <Card.Meta>
              <span className='date'>
                Joined in 2015
              </span>
            </Card.Meta>
            <Card.Description>
              Matthew is a musician living in Nashville.
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              22 Friends
            </a>
          </Card.Content>
        </Card>
      </Popup>
    );
  }
}

export default ProfilePopUp;