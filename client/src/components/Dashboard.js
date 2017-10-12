import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import ProfilePic from './ProfilePic';
import DashNav from './DashNav';
import Workouts from './Workouts';
import Requests from './Requests';
import Invites from './Invites';
import Events from './Events';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'my workouts',
      data: [],
      var: true
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.update = this.update.bind(this);
    this.dataPull = this.dataPull.bind(this);
  }

  dataPull() {
    fetch('/dashboard', { credentials: "include" })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        this.setState({ data: response })
      })

    console.log('getting data...')
  }


  update(userid, postingId, requestId) {
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({postingId: postingId, requestId: requestId})
    }
    fetch(`/postings/accept/${userid}`, options)
      .then(response => {
        var newVar = !this.state.var;
        this.setState({ var: newVar });
        this.dataPull();
      })

    // fetch(`/postings/requests/${id}`, { credentials: "include" })
    //   .then(response => response.json())
    //   .then(response => {
    //     //console.log('requests response #' + id, response);
    //     this.setState({ requests: response })
    //   })
    console.log('getting posting requests');
  }

  handleTabClick(e, { name }) {
    // console.log('I\'ve been clicked, and my name is: ' + name);
    this.setState({ view: name });
  };

  componentDidMount() {
    this.dataPull();
  }

  render() {
    var { listings } = this.props;
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var userPic = '/' + images[Math.floor(Math.random() * images.length)];
    var user = {picture: userPic};

    return (
      <Container style={{marginTop: '20px'}}>

        <ProfilePic user={this.props.user || user}/>

        <DashNav handleClick={this.handleTabClick} view={this.state.view}/>

        {this.state.view === 'my workouts' && (<Workouts key='workouts' data={this.state.data} userPic={this.user} user={this.props.user} update={this.update} dataPull={this.dataPull} />)}
        {this.state.view === 'my requests' && ([<Requests key='requests' user={this.props.user}/>])}
        {this.state.view === 'upcoming workouts' && ([<Invites key='invites'/>])}
        {this.state.view === 'events' && ([<Events key='events'/>])}

      </Container>
    )
  }
}

export default Dashboard;

//profile pic
  //username
//
