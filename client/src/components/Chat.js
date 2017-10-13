import React, { Component } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
var moment = require('moment');

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    //var { listing, open, hideListingModal, userImage, user } = this.props;
    //console.log('listing modal user', user);
    return (
      <Comment>
        <Comment.Content>
          <Comment.Author as='a'>{this.props.message.userName}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(this.props.message.date).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text>{this.props.message.name}</Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }

}

export default Chat;


