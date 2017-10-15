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
      owner: {},
      friends: []
    };

    this.updateListings = this.updateListings.bind(this);
    this.hideListingModal = this.hideListingModal.bind(this);
    this.showListingModal = this.showListingModal.bind(this);
    this.fetchOwnerData = this.fetchOwnerData.bind(this);
    this.fetchFriends = this.fetchFriends.bind(this);
  }

  toggleVisibility = () => this.setState({ barVisible: !this.state.barVisible })

  componentDidMount() {
    this.setState({visible: true});
    console.log('mounting');
    this.updateListings();
    console.log(this.state.listings);
  }  

  updateListings () {
    fetch('/postings', {credentials: 'include'})
      .then(response => response.json())
      .then(listings => {
        console.log('listings', listings);
        this.fetchFriends();
        this.setState({
          listings: listings,
          allListings: listings,
        });
      });
  }

  fetchFriends () {
    if (!this.props.user) {
      console.error("fetchFrieds - user is null")
      return;
    }
    fetch('/friends/' + this.props.user.id, {credentials: 'include'})
      .then(response => response.json())
      .then(data => {
        console.log('Friends ', data.friends);
        console.log('Requesters ', data.requesters);
        var myFriends = [];
        data.friends.map(friend => {
          myFriends.push(friend.id);
        });
        this.setState({
          friends: myFriends,
        });        
      });    
  }

  fetchOwnerData (ownerId, listing) {
    fetch('/profile/' + ownerId, {credentials: 'include'})
      .then(response => response.json())
      .then(owner => {
        console.log('Owner Data', owner);
        //this.setState({owner});
        this.setState({
          owner,
          showModal: true,
          selectedListing: listing
        });        
      });
  }

  showListingModal(listing) {
    this.fetchOwnerData(listing.userId, listing);
  }

  hideListingModal () {
    this.updateListings(); 

    this.setState({
      showModal: false,
      selectedListing: null
    });
  }
  handleSort = (sort) => {
    //console.log(sort);
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
    else {
      var today = new Date().getTime();
      newListings = listings.filter(item => (new Date(item.date).getTime()) < today);
    }
    this.setState({listings: newListings});
    
  }

  handleBudClick = (buddies) => {
    var listings = this.state.allListings;
    var newListings = [];
    if (buddies === 2) {
      newListings = listings.filter(item => item.modified_buddies <= 2);
    }
    if (buddies === 3) {
      newListings = listings.filter(item => (item.modified_buddies <= 5 && item.modified_buddies >= 3));
    }
    if (buddies === 6) {
      newListings = listings.filter(item => item.modified_buddies >= 6);
    } 
    if (buddies === 'friends') {
      var friends = this.state.friends;

      newListings = listings.filter(item =>  friends.includes(item.ownerId));

    }
    this.setState({listings: newListings});
    
  }
  render() {
    var { listings, showModal, selectedListing } = this.state;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var randomPic = '/' + images[Math.floor(Math.random() * images.length)];
    console.log(this.props);
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
              <Dropdown.Item key='previous' onClick={() => this.handleItemClick('previous')}>Previous</Dropdown.Item>
              <Dropdown.Header icon='time' content='Duration' />
                <Dropdown.Item key='twoHrs' onClick={() => this.handleItemClick(2)}>Less than 2 hrs</Dropdown.Item>
                <Dropdown.Item key='threeHrs' onClick={() => this.handleItemClick(3)}>3 to 5 hrs</Dropdown.Item>
                <Dropdown.Item key='sixHrs' onClick={() => this.handleItemClick(6)}>5 hrs+!</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header icon='smile' content='Friends/Buddies' />
                <Dropdown.Item key='twobuds' onClick={() => this.handleBudClick(2)}>Less than 2</Dropdown.Item>
                <Dropdown.Item key='threebuds' onClick={() => this.handleBudClick(3)}>3 to 5</Dropdown.Item>
                <Dropdown.Item key='sixbuds' onClick={() => this.handleBudClick(6)}>5+ !</Dropdown.Item>
                <Dropdown.Item key='myFriends' onClick={() => this.handleBudClick('friends')}>Only my Friends</Dropdown.Item>
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
        {showModal && (
          <ListingModal 
            listing={selectedListing} 
            open={this.state.showModal} 
            hideListingModal={this.hideListingModal} 
            user={this.props.user}
            ownerImage={selectedListing.picture ? selectedListing.picture : randomPic}
            owner={this.state.owner}
            showRequest={true}
          />
        )}
      </Container>]
    );
  }
}

export default Listings;