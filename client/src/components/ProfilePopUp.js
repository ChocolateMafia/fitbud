import React, { Component } from 'react';
import { Popup, Image, Button} from 'semantic-ui-react';


class ProfilePopUp extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    console.log(this.props.children);

    console.log('hello world');
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];

    return (

      <Popup
        trigger={this.props.trigger}
        on={this.props.on}
        position='top left'
      >
        <h1>Hello World</h1>
      </Popup>
    );
  }
}

export default ProfilePopUp;