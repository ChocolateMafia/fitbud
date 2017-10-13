import React, { Component } from 'react';
import { Card, Container, Icon, Transition, Popup, Button } from 'semantic-ui-react';
import ListingCard from './ListingCard.js';
import ListingModal from './ListingModal.js';

class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      listings: [],
      showModal: false,
      selectedListing: null,
      owner: {}
    };

    this.updateListings = this.updateListings.bind(this);
    this.hideListingModal = this.hideListingModal.bind(this);
    this.showListingModal = this.showListingModal.bind(this);
    this.fetchOwnerData = this.fetchOwnerData.bind(this);
  }

  updateListings () {
    fetch('/postings', {credentials: 'include'})
      .then(response => response.json())
      .then(listings => {
        console.log('listings', listings);
        this.setState({listings: listings});
      });
  }

  fetchOwnerData (ownerId) {
    fetch('/profile/' + ownerId, {credentials: 'include'})
      .then(response => response.json())
      .then(owner => {
        console.log('Owner Data', owner);
        this.setState({owner});
      });
  }

  componentDidMount() {
    this.setState({visible: true});
    console.log('mounting');

    this.updateListings();
  }

  showListingModal(listing) {
    this.fetchOwnerData(listing.userId);
    this.setState({
      showModal: true,
      selectedListing: listing
    });
  }

  hideListingModal () {
    this.updateListings(); 

    this.setState({
      showModal: false,
      selectedListing: null
    });
  }

  render() {
    var { listings, showModal, selectedListing } = this.state;
    console.log(this.props);
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];

    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>        
          <Card.Group itemsPerRow={3}>
            {listings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                showListingModal={this.showListingModal}
                userPic={listing.picture ? listing.picture : ('/' + images[Math.floor(Math.random() * images.length)])} 
              />
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
            ownerImage={selectedListing.picture ? selectedListing.picture : randomPic}
            owner={this.state.owner}
          />
        )}
      </Container>]
    );
  }
}

export default Listings;