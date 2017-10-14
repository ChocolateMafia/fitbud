import React, { Component } from 'react';
import { Modal, Header, Button, Image, Icon, Divider, Comment, Form} from 'semantic-ui-react';
import Chat from './Chat';
import ProfilePopUp from './ProfilePopUp';
import Pusher from 'pusher-js';
var pusherKey = '7f1979bc2b65ed9a895f';
var eventsChannel = 'events';

class ListingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestSent: false,
      messages: [],
      text: '',
      chatOpen: false
    }
    //this.fetchChat = this.fetchChat.bind(this);
  }

  componentWillMount() {
    this.pusher = new Pusher(pusherKey, {
      cluster: 'us2',
      encrypted: true
    });
    this.channel = this.pusher.subscribe(eventsChannel);
  }

  componentDidMount = () => {
    this.fetchChat();
    this.channel.bind('event', function(data) {
      console.log('data', data);
      if (this.state.chatOpen) {
        this.fetchChat();
      }
    }, this);
  }

  sendRequest = () => {
    this.setState({
      requestSent: true
    })

    fetch(`/postings/${this.props.listing.id}`, {
      credentials: 'include',
      method: 'POST'
    }).then(response => {
      if (response.ok) console.log('request made!');
    })
  }

  handleTextBox = (e) => {
    var text = e.target.value
    this.setState({
      text: text
    });
  }

  handleReply = () => {
    var message = {
      name: this.state.text,
      date: new Date(),
      userId: this.props.user.id,
      postingId: this.props.listing.id
    };
    this.setState({text: ''});
    var self = this;
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(message)
    }
    fetch('/messages', options)
      .then(response => {
        if (response.ok) {
          self.fetchChat();
        } 
      })
    console.log(message);
  }

  fetchChat = () => {
    fetch(`/messages/${this.props.listing.id}`, {
      credentials: 'include',
      method: 'GET'
    }).then(response => response.json())
      .then(messages => {
        console.log('messages', messages);
        this.setState({
          chatOpen: true,
          messages: messages
        })
      })
  }

  render() {
    var { listing, open, hideListingModal, ownerImage, user, showRequest } = this.props;

    return (
      <Modal open={open} onClose={hideListingModal} closeIcon dimmer='false'>
        <Modal.Header>{listing.title}</Modal.Header>
        
        <Modal.Content image scrolling>

          <ProfilePopUp 
            user={this.props.user} 
            owner={this.props.owner} 
            on='hover' 
            position='top left' 
            component={<Image size='small' src={ownerImage} wrapped shape='circular'/>}
          />

          <Modal.Description>
            <Header>{listing.name}</Header>
            <p>Location: <span>{listing.location}</span></p>
            <p>Meetup point: <span>{listing.meetup_spot}</span></p>
            <p>Date: <span>{new Date(listing.date).toDateString()}</span></p>
            <p>Duration: <span>{listing.duration} hours</span></p>
            <p>Details: <span>{listing.details}</span></p>
          </Modal.Description>
        </Modal.Content>
        {
          this.state.chatOpen ? 

          (
            <Modal.Content scrolling>
              <Divider horizontal>Chat</Divider>
              <Comment.Group>
                {this.state.messages.map((message, index) => 
                  <Chat 
                  key={index}
                  message={message}
                  listing={listing}
                  />
                )}
                <Form reply>
                  <Form.TextArea onChange={this.handleTextBox} value={this.state.text}/>
                  <Button content='Add Reply' labelPosition='left' icon='edit' primary onClick={this.handleReply}/>
                </Form>
              </Comment.Group>
            </Modal.Content>
           
          ): null
        }

        <Modal.Actions>
          <Button secondary onClick={hideListingModal}>
            Close<Icon name='close' />
          </Button>

          {user && showRequest && (user.id !== listing.ownerId) && (listing.status !== 'accept') && <Button disabled={this.state.requestSent || listing.status === 'pending'} primary onClick={this.sendRequest}>
            { this.state.requestSent || listing.status === 'pending' ? 'Pending' : 'Request to join' } <Icon name='right chevron' />
          </Button>}
          {user && (user.id !== listing.ownerId) && (listing.status === 'accept') && <Button style={{background: '#21ba45'}} disabled={true} primary>
            Accepted!
          </Button>}
          <Button disabled={user === null} onClick={this.fetchChat}><Icon name="chat" /></Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

export default ListingModal;
