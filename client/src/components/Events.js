import React, { Component } from 'react';
import { Icon, Feed } from 'semantic-ui-react';
var moment = require('moment');

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [{}]
    }
  }

  componentDidMount() {
    fetch('/events', { credentials: "include" })
      .then(response => response.json()
        .then(
          response => {
            this.setState({ events: response });
            console.log('componentDidMount EVENTS:', response);
          }
        )
      )

    console.log('getting invites...')
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  render() {
    return (
     <Feed>
     {this.state.events.map(event => (
        <Feed.Event key={event.id}>
          <Feed.Label>
            <img src={this.images[Math.floor(Math.random() * this.images.length)]} />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
               {event.description}
              <Feed.Date>{moment(event.created).fromNow()}</Feed.Date>
            </Feed.Summary>
            <Feed.Meta>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
       ))}
      </Feed>
    )
  }
}

export default Events;

