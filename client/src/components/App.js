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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: null,
      visible: null,
    };

    this.handleAuthenticated = this.handleAuthenticated.bind(this);
    this.handleSignOff = this.handleSignOff.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);

    this.cookies = new Cookies();
    console.log('checking auth...');
    this.checkAuth();
  }
  
  checkAuth () {
    fetch('/profile', {
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

            <Route exact path='/dashboard' render={props => (
              <Dashboard listings={data} view='my workouts' user={this.state.user} {...props} />
            )} />

            <Route exact path='/dashboardEvents' render={props => (
              <Dashboard listings={data} user={this.state.user} view='events' {...props} />
            )} />

            <Route exact path='/create' render={props => (
              <CreateListing {...props} />
            )} />

            <Route exact path='/profile' render={props => (
              <Profile user={this.state.user} handleProfileUpdate={this.handleProfileUpdate} {...props} />
            )} />

            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
