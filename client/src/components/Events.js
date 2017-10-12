import React, { Component } from 'react';
import { Card, Icon, Image, Table } from 'semantic-ui-react';

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
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              When
            </Table.HeaderCell>
            <Table.HeaderCell>
              What
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
         {this.state.events.map(event => (
          <Table.Row key={event.id}>
            <Table.Cell>
              {event.created}
            </Table.Cell>
            <Table.Cell>
              {event.description}
            </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

}

export default Events;

