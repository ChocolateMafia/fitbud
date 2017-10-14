import React, { Component } from 'react';
import { Card, Image, Transition, Container } from 'semantic-ui-react';
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

    this.fetchOwnerData = this.fetchOwnerData.bind(this);
    this.showListingModal = this.showListingModal.bind(this);
    this.hideListingModal = this.hideListingModal.bind(this);
  }

  componentDidMount() {
    this.setState({visible: true});
    fetch('/dashboard/requests', { credentials: 'include' })
      .then(response => response.json()
        .then(
          response => {
            this.setState({ requests: response });
          }
        )
      );
  }

  fetchOwnerData (ownerId, listing) {
    fetch('/profile/' + ownerId, {credentials: 'include'})
      .then(response => response.json())
      .then(owner => {
        console.log('Owner Data', owner);
        this.setState({
          owner,
          showModal: true,
          selectedListing: listing
        });        
      });
  }  

  showListingModal (listing) {
    this.fetchOwnerData(listing.userId, listing);
  }

  hideListingModal () {
    this.setState({
      showModal: false,
      selectedListing: null
    });
  }

  render() {
    var { selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

    //console.log('props from dashboard to requests', this.props);
    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group itemsPerRow={3}>
            {this.state.requests.map(listing => (
              <Card key={listing.id} onClick={() =>this.showListingModal(listing)}>
                <Card.Content>
                  <Image src={listing.picture ? listing.picture : '/' + images[Math.floor(Math.random() * images.length)]} size='mini' floated='left'/>
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
          <ListingModal 
            listing={selectedListing} 
            open={this.state.showModal} 
            hideListingModal={this.hideListingModal} 
            user={this.props.user}
            ownerImage={selectedListing.picture ? selectedListing.picture : '/' + images[Math.floor(Math.random() * images.length)]} 
            owner={this.state.owner}
          />
        )}
      </Container>]
    );
  }

}

export default Requests;
