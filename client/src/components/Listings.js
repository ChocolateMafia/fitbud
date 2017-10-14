import React, { Component } from 'react';
import { Card, Container, Icon, Transition, Segment, Button, Menu, Image, Header, Form, Divider, Dropdown, Popup} from 'semantic-ui-react';
import ListingCard from './ListingCard.js';
import ListingModal from './ListingModal.js';

class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      listings: [],
      allListings: [],
      showModal: false,
      selectedListing: null,
      owner: {}
    };

    this.updateListings = this.updateListings.bind(this);
    this.hideListingModal = this.hideListingModal.bind(this);
    this.showListingModal = this.showListingModal.bind(this);
    this.fetchOwnerData = this.fetchOwnerData.bind(this);
  }

  toggleVisibility = () => this.setState({ barVisible: !this.state.barVisible })

  updateListings () {
    fetch('/postings', {credentials: 'include'})
      .then(response => response.json())
      .then(listings => {
        console.log('listings', listings);
        this.setState({
          listings: listings,
          allListings: listings,
        });
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
  handleSort = (sort) => {
    console.log(sort);
    this.setState({
      sort: sort
    });
    var listings = this.state.allListings;
    if (sort === 'newest') {
      listings.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } 
        if (a.id < b.id) {
          return 1;
        }
        return 0;
      });
    } else {
      listings.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        } 
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
    }
    this.setState({listings: listings});
  }

  handleItemClick = (hrs) => {
    var listings = this.state.allListings;
    var newListings = [];
    if (hrs === 2) {
      newListings = listings.filter(item => item.duration <= 2);
    }
    if (hrs === 3) {
      newListings = listings.filter(item => (item.duration <= 5 && item.duration >= 3));
    }
    if (hrs === 6) {
      newListings = listings.filter(item => item.duration >= 6);
    }
    this.setState({listings: newListings});
    
  }
  render() {
    var { listings, showModal, selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];

    // console.log(this.images);

    return (
      [ 
        <div>
          <Dropdown key='sort' text='Sort by' pointing style={{marginLeft: '20px', marginTop: '20px'}}>          
            <Dropdown.Menu> 
              <Dropdown.Item key='newest' onClick={() => this.handleSort('newest')}>Newest</Dropdown.Item>
              <Dropdown.Item key='upcoming' onClick={() => this.handleSort('upcoming')}>Upcoming</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            <Dropdown key='filter' text='Filter by' pointing style={{marginLeft: '20px', marginTop: '20px'}}>          
            <Dropdown.Menu> 
              <Dropdown.Header icon='time' content='Duration' />
              <Dropdown.Item key='twoHrs' onClick={() => this.handleItemClick(2)}>Less than 2 hrs</Dropdown.Item>
              <Dropdown.Item key='threeHrs' onClick={() => this.handleItemClick(3)}>3 to 5 hrs</Dropdown.Item>
              <Dropdown.Item key='sixHrs' onClick={() => this.handleItemClick(6)}>5 hrs+!</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header icon='smile' content='Friends' />
              
            </Dropdown.Menu>
          </Dropdown>
        <div><Divider /></div>
          <Transition visible={this.state.visible} duration={1000} animation='fade'>
            <Container style={{marginTop: '40px'}}>
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
          </Transition>
         </div>,
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