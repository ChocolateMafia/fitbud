import React, { Component } from 'react';
import { Card, Icon, Image, Transition, Container } from 'semantic-ui-react';
import ListingModal from './ListingModal.js';
import RatingDropdown from './RatingDropdown';

class PastWorkouts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invites: [],
      visible: false,
      showModal: false,
      selectedListing: null
    };

    this.fetchOwnerData = this.fetchOwnerData.bind(this);
    this.showListingModal = this.showListingModal.bind(this);
    this.hideListingModal = this.hideListingModal.bind(this);
    this.fetchWorkouts = this.fetchWorkouts.bind(this);
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

  fetchWorkouts () {
    fetch('/dashboard/accepted', { credentials: 'include' })
      .then(response => response.json()
        .then(
          response => {
            console.log('invites', response);
            this.setState({ 
              invites: response.filter(item => (new Date(item.date).getTime()) < (new Date().getTime())),
              visible: true
            });
          }
        )
      );
    console.log('getting invites...');    
  }

  componentDidMount() {
    this.fetchWorkouts();
  }

  render() {
    var { invites, showModal, selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var userPic = '/' + images[Math.floor(Math.random() * images.length)];

    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group itemsPerRow={3}>
            {invites.map((listing) => (
              <Card key={listing.id}>
                <Card.Content onClick={() => this.showListingModal(listing)}>
                  <Image src={this.props.user.picture || userPic} size='mini' floated='left'/>
                  <Card.Header>{listing.title}</Card.Header>
                  <Card.Meta>{listing.name}</Card.Meta>
                  <Card.Meta>{listing.location}</Card.Meta>
                  <Card.Description>{`${listing.details} on ${new Date(listing.date).toDateString()} for ${listing.duration} hour(s)`}</Card.Description>
                </Card.Content>
                <Card.Content extra >
                  <RatingDropdown
                    postingId={listing.id} 
                    user={this.props.user}
                  />
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
            ownerImage={this.props.user.picture || userPic}
            owner={this.state.owner}
            showRequest={false}
          />
        )}
      </Container>]
    );
  }


}

export default PastWorkouts;
