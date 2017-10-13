import React, { Component } from 'react';
import { Card, Icon, Image, Transition, Container } from 'semantic-ui-react';
import ListingModal from './ListingModal.js';

class Requests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
      visible: false,
      listing: [],
      showModal: false,
      selectedListing: null
    };
  }

  componentDidMount() {
    this.setState({visible: true});
    fetch('/dashboard/requests', { credentials: "include" })
      .then(response => response.json()
        .then(
          response => {
            this.setState({ requests: response });
          }
        )
      )
  }

  showListingModal(listing) {
    console.log(listing);
    this.setState({
      showModal: true,
      selectedListing: listing
    });
  }

  hideListingModal = () => {
    this.setState({
      showModal: false,
      selectedListing: null
    });
  }
  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  render() {
    var { listing, showModal, selectedListing } = this.state;
    //console.log('props from dashboard to requests', this.props);
    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group itemsPerRow={3}>
            {this.state.requests.map(listing => (
              <Card key={listing.id} onClick={() =>this.showListingModal(listing)}>
                <Card.Content>
                  <Image src={listing.picture? listing.picture: '/' + this.images[Math.floor(Math.random() * this.images.length)]} size='mini' floated='left'/>
                  <Card.Header>{listing.activity}</Card.Header>
                  <Card.Meta>{listing.location}</Card.Meta>
                  <Card.Description>{`Schedule on ${new Date(listing.date).toDateString()} for ${listing.duration} hours`}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </Transition>,
        <Container>
        {this.state.showModal && (
          <ListingModal listing={selectedListing} open={this.state.showModal} 
                        hideListingModal={this.hideListingModal} 
                        user={this.props.user}
                        userImage={selectedListing.picture ? selectedListing.picture : '/' + this.images[Math.floor(Math.random() * this.images.length)]} />
        )}
      </Container>]
    )
  }

}

export default Requests;
