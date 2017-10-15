import React, { Component } from 'react';
import { Card, Icon, Image, Accordion, Button, Rating } from 'semantic-ui-react';

import DropdownRequest from './DropdownRequest';

class RatingDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1,
      requests: [],
      members: []
    };

    this.dropdown = this.dropdown.bind(this);
    this.fetchMemberData = this.fetchMemberData.bind(this);
    this.postUserRating = this.postUserRating.bind(this);
  }

  fetchMemberData (listingId) {
    fetch('/postings/members/' + listingId, {credentials: 'include'})
      .then(response => response.json())
      .then(data => {
        console.log('Members Data', data.members);
        this.setState({
          members: data.members.filter(member => member.id !== this.props.user.id)
        });
      });    
  }

  dropdown (e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    console.log('activeIndex', newIndex);
    this.setState({ activeIndex: newIndex });
  }

  postUserRating (event, data, member) {
    let userId = member.id;
    let userRating = member.rating;
    let userRatingCount = member['r_count'];
    let newRating = data.rating;
    let formData;

    if (!userRating) {
      formData = {
        'rating': newRating,
        'r_count': 1
      };
    } else {
      formData = {
        'rating': (userRating * userRatingCount + newRating) / (userRatingCount + 1),
        'r_count': userRatingCount + 1
      };
    }

    console.log('User Rating formData', formData);

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    };

    fetch('/profile/rating/' + userId, options)
      .then(response => {
        if (response.ok) {
          this.fetchMemberData(this.props.postingId);
        }
      });
  }

  componentDidMount() {
    this.fetchMemberData(this.props.postingId);
  }

  render() {
    return (
      <div>
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.dropdown}>
            <Icon name='dropdown' />
            Rating Members ({this.state.members ? this.state.members.length : 0})
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this.state.members.map((member) => (
              <div>
                {member.name}
                <Rating onRate={(event, data) => this.postUserRating(event, data, member)} icon='star' defaultRating={member.rating} maxRating={5} />
              </div>
            ))}
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

//            <DropdownRequest requests={this.state.requests} update={this.props.update} />


export default RatingDropdown;

//each dropdown list pulls the users that are requesting
