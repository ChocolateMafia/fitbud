import React, { Component } from 'react';
import { Card, Icon, Image, Transition, Container } from 'semantic-ui-react';
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
  }

  componentDidMount() {
    this.setState({visible: true});
  }

  showListingModal(listing) {
    //console.log(listing);
    this.setState({
      showModal: true,
      selectedListing: listing
    });
  }

  hideListingModal = () => {
    this.setState({
      showModal: false,
      selectedListing: null
    })
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
              <Card key={listing.id} onClick={() =>this.showListingModal(listing)}>
                <Card.Content>
                  <Image src={this.props.user.picture || userPic} size='mini' floated='left'/>
                  <Card.Header>{listing.title}</Card.Header>
                  <Card.Meta>{listing.location}</Card.Meta>
                  <Card.Description>{`${listing.details} on ${listing.date} for ${listing.duration} hour(s)`}</Card.Description>
                  <Card.Content extra>
                    <WorkoutDropdown postingId={listing.id} buddies={listing.buddies} update={this.props.update} dataPull={this.props.dataPull} />
                  </Card.Content>
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
                        userImage={this.props.user.picture || userPic} />
        )}
      </Container>]
    )
  }

}

//dropdown menu fetches request postings

//once endpoint is created, data can be passed from dashboard to workouts
  //create accept button function inside workouts or dashboard
    //updateRequest route
    //passing postingId
  //pass specific workout data from workouts to new buddies component
    //render buddies, unaccepted with accept button
    //accepted buddies with green text

export default Workouts;
