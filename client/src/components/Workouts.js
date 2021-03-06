import React, { Component } from 'react';
import { Card, Image, Transition, Container } from 'semantic-ui-react';
import WorkoutDropdown from './WorkoutDropdown';
import ListingModal from './ListingModal.js';

class Workouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    var { listing, showModal, selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var userPic = '/' + images[Math.floor(Math.random() * images.length)];

    //console.log('what is passing to workouts from dashboard', this.props);
    return (
      [<Transition visible={this.state.visible} duration={1000} animation='fade'>
        <Container style={{marginTop: '20px'}}>
          <Card.Group itemsPerRow={3}>
            {this.props.data.map(listing => (
              <Card key={listing.id}>
                <Card.Content onClick={() => this.showListingModal(listing)}>
                  <Image src={this.props.user.picture || userPic} size='mini' floated='left'/>
                  <Card.Header>{listing.title}</Card.Header>
                  <Card.Meta>{listing.location}</Card.Meta>
                  <Card.Description>{`${listing.details} on ${new Date(listing.date).toDateString()} for ${listing.duration} hour(s)`}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <WorkoutDropdown postingId={listing.id} buddies={listing.buddies} update={this.props.update} dataPull={this.props.dataPull} />
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

//dropdown menu fetches request postings
// once endpoint is created, data can be passed from dashboard to workouts
// create accept button function inside workouts or dashboard
// updateRequest route
// passing postingId
// pass specific workout data from workouts to new buddies component
// render buddies, unaccepted with accept button
// accepted buddies with green text

export default Workouts;
