import React, { Component } from 'react';
import { Card, Container, Icon, Transition } from 'semantic-ui-react';
import ListingCard from './ListingCard.js';
import ListingModal from './ListingModal.js';

class Listings extends Component {
  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      listings: [],
      showModal: false,
      selectedListing: null
    }
  }

  updateListings = () => {
    fetch('/postings', {
      credentials: 'include'
    }).then(response => response.json())
      .then(listings => {
        console.log('listings', listings);
        this.setState({listings: listings})
      })
  }

  componentDidMount() {
    this.setState({visible: true})
    console.log('mounting');

    this.updateListings();
  }

  showListingModal(listing) {
    this.setState({
      showModal: true,
      selectedListing: listing
    })
  }

  hideListingModal = () => {
    this.updateListings(); 

    this.setState({
      showModal: false,
      selectedListing: null
    })
  }

  render() {
    var { listings, showModal, selectedListing } = this.state;
    console.log(this.props);
    // console.log(this.images);

    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group itemsPerRow={3}>
            {listings.map(listing => (

              <ListingCard listing={listing} showListingModal={this.showListingModal.bind(this)}
                           user={'/' + this.images[Math.floor(Math.random() * this.images.length)]} 
              />

            ))}
          </Card.Group>
        </Container>
      </Transition>,
      <Container>
        {this.state.showModal && (
          <ListingModal listing={selectedListing} open={this.state.showModal} 
                        hideListingModal={this.hideListingModal} 
                        user={this.props.user}
                        userImage={'/' + this.images[Math.floor(Math.random() * this.images.length)]}  />
        )}
      </Container>]
    )
  }
}

export default Listings;