import React, { Component } from 'react';
import { Form, Container, Grid, Header, Image, Segment, Button, Message, Transition, Icon } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';
import firebase from 'firebase';
import {facebookProvider, auth} from './../firebase/config';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      submit: false,
      email: '',
      password: ''
    };

    console.log(this.props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
  }

  componentDidMount() {
    this.setState({
      visible: true
    });
  }

  handleSubmit (event) {
    event.preventDefault();

    this.setState({submit: true});

    var payload = {
      username: this.state.email,
      password: this.state.password
    };

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload)
    };

    fetch('/login', options)
      .then(response => {
        if (response.ok) {
          this.setState({
            submit: false
          });
          return response.json();
        } else {
          this.setState({
            errorHeader: 'Incorrect credentials',
            errorContent: 'Please try again',
            formError: true,
            submit: false
          });
        }
      }).then(user => {
        console.log(user);
        if (user && user.email) {
          this.props.authenticate(user);
          this.props.history.replace('/');                    
        }
      });
  }

  handleInputChange (event) {
    console.log(`${event.target.name} is changing to ${event.target.value}`);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // firebase facebook sign in authenticate method -> not used, using passport auth instead
  handleFBLogin () {
    auth().signInWithPopup(facebookProvider)
      .then(result => {
        console.log('FB user logged in', result); 

        var payload = {
          uid: result.user.uid,
          token: result.credential.accessToken,
          name: result.user.displayName,
          username: result.user.email || 'abc@abc.com',
          password: 'workoutbuddy',
          gender: result.additionalUserInfo.profile.gender || null,
          picture: result.user.photoURL || null
        };

        console.log(payload);

        var options = {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload)
        };

        fetch('/auth/facebook', options)
          .then(response => {
            if (response.ok) {
              this.setState({
                submit: false
              });
              return response.json();
            } else {
              this.setState({
                errorHeader: 'Incorrect credentials',
                errorContent: 'Please try again',
                formError: true,
                submit: false
              });
            }
          }).then(user => {
            console.log(user);
            if (user && user.email) {
              this.props.authenticate(user);
              this.props.history.replace('/');                    
            }
          });        
      })
      .catch(function(error) {
        console.error(error.message);
      });
  }

  // handleFBLogout() {
  //   auth().signOut()
  //     .then(result => {
  //       console.log('FB user logged out', result);
  //     })
  //     .catch(function(error) {
  //       console.error(error.message);
  //     });
  // }

  render() {
    return (
      <Transition visible={this.state.visible} animation='fade' duration={1000}>
        <div className='login-form'>
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 90%;
            }
          `}</style>
          <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
          >
            <Grid.Column style={{ maxWidth: 500 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Log in to your account
              </Header>
              <Form size='large' onSubmit={this.handleSubmit} error={this.state.formError}>
                <Segment>
                  <Form.Input
                    autoFocus='true'
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='E-mail address'
                    name='email'
                    onChange={this.handleInputChange}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    name='password'
                    onChange={this.handleInputChange}
                  />
                  <Button loading={this.state.submit} color='teal' fluid size='large'>Log In</Button>                              
                </Segment>
                <Message 
                  error 
                  header={this.state.errorHeader}
                  content={this.state.errorContent}
                />
              </Form>
              <Button onClick={this.handleFBLogin} color='facebook' size='large' fluid><Icon name='facebook' />Log In With Facebook</Button>
              <Message>
                New to us? <Link to='/signup'>Sign Up</Link>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      </Transition>
    );
  }
}

export default Login;