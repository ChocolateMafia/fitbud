import React, { Component } from 'react';
import Cookies from 'universal-cookie';                                                                                                                                      
import MainNav from './MainNav';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import Listings from './Listings';
import NoMatch from './NoMatch';
import Dashboard from './Dashboard';
import CreateListing from './CreateListing';
import Profile from './Profile';
import data from '../sampleData';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Pusher from 'pusher-js';
var pusherKey = '7f1979bc2b65ed9a895f';
var eventsChannel = 'events';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: null,
      visible: null,
      eventsCount: 0
    };

    this.handleAuthenticated = this.handleAuthenticated.bind(this);
    this.handleSignOff = this.handleSignOff.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
    this.getEventsCount = this.getEventsCount.bind(this);
    this.handleEventsClick = this.handleEventsClick.bind(this);

    this.cookies = new Cookies();
    console.log('checking auth...');
    this.checkAuth();

    console.log('something   ');
  }
  
  checkAuth () {
    fetch('/login', {
      credentials: 'include'
    }).then(response => {
      console.log(response);
      return response.ok ? response.json() : {};
    }).then(user => {
      console.log(user);
      if (user && user.name) {
        this.setState({
          user: user,
          authenticated: true
        });
      }
    });
  }

  componentWillMount() {
    this.pusher = new Pusher(pusherKey, {
      cluster: 'us2',
      encrypted: true
    });
    this.channel = this.pusher.subscribe(eventsChannel);
  }

  componentDidMount = () => {
    this.getEventsCount();
    this.channel.bind('event', function(data) {
      console.log('data', data, this.state.user.id);
      if (data.message.indexOf(this.state.user.id) !== -1) {
        this.getEventsCount();
      }
    }, this);
  }

  handleProfileUpdate () {
    this.checkAuth();
  }

  handleAuthenticated (user) {
    this.setState({
      authenticated: true,
      user: user
    });
    console.log('User authenticated...');
  }

  getEventsCount = () => {
    fetch('/events/count', { credentials: 'include' })
      .then(response => response.json())
      .then(response => {
        this.setState({eventsCount: response});
    });
  }

  handleEventsClick = () => {
    fetch('events/update', { credentials: 'include' })
      .then(response => {
         this.setState({eventsCount: 0});
    })
  }

  handleSignOff () {
    this.setState({
      authenticated: false,
      user: null
    });
    fetch('/logout', {
      credentials: 'include'
    }).then(response => console.log(response.status));
  }

  render() {
    return (
      <Router>
        <div>
          <MainNav 
            authenticate={this.handleAuthenticated} 
            isAuthed={this.state.authenticated} 
            signoff={this.handleSignOff} 
            user={this.state.user}
            eventsCount={this.state.eventsCount}
            handleEventsClick={this.handleEventsClick}
          />
          <Switch>
            <Route exact path='/' render={props => (
              <Home user={this.state.user} visible={this.state.visible} {...props} />
            )} />
            
            <Route exact path='/listings' render={props => (
              <Listings {...props} user={this.state.user} />
            )} />

            <Route exact path='/about' component={About} />

            <Route exact path='/login' render={props => (
              <Login authenticate={this.handleAuthenticated} {...props} />
            )} />

            <Route exact path='/signup' component={Signup} />

            <Route exact path='/dashboard' render={props => ( this.state.authenticated ? 
              (<Dashboard listings={data} user={this.state.user} {...props} />) : 
              (<Redirect to='/' />)
            )} />

            <Route exact path='/create' render={props => ( this.state.authenticated ? 
              (<CreateListing {...props} />) :
              (<Redirect to='/' />)
            )} />

            <Route exact path='/profile' render={props => ( this.state.authenticated ? 
              (<Profile user={this.state.user} handleProfileUpdate={this.handleProfileUpdate} {...props} />) :
              (<Redirect to='/' />)
            )} />

            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
