import React, { Component } from 'react';
import LoginButtonModal from './LoginButtonModal.js';
import { Menu, Input, Button, Label, Dropdown } from 'semantic-ui-react';
import { NavLink, Link, Redirect } from 'react-router-dom';

class MainNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventsCount: 0
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleLoginClick() {
    fetch('events/update', { credentials: 'include' })
      .then(response => {
        this.setState({eventsCount: 0});
      })
  }
  componentDidMount() {
    this.updateEventCount();
  }

  updateEventCount() {
    fetch('/events/count', { credentials: 'include' })
      .then(response => response.json())
      .then(response => {
        this.setState({eventsCount: response});
        setTimeout(this.updateEventCount.bind(this), 5000);
    });
  }

  signOutRedirect = () => {}

  render() {
    console.log('MainNav render');
    return (
      <Menu secondary size='huge' style={{marginBottom: 0}}>
        <Menu.Item exact name='home' as={NavLink} to='/' />
        <Menu.Item name='listings' as={NavLink} to='/listings' />
        {(this.props.isAuthed) && (this.state.eventsCount > 0) && (
          <Menu.Item name='events' onClick={this.handleLoginClick} as={NavLink} to='/dashboardEvents'>
            Events <Label color='teal'>{this.state.eventsCount}</Label>
          </Menu.Item>)}
        {(this.props.isAuthed) && (this.state.eventsCount === 0)  && (
          <Menu.Item name='events' onClick={this.handleLoginClick} as={NavLink} to='/dashboardEvents'>
            Events
           </Menu.Item>)}
        <Menu.Item name='about' as={NavLink} to='/about' />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>

          {!this.props.isAuthed && ([
            <Menu.Item key='login' style={{paddingLeft: '0px'}}> 
              {/*<Button content='Log In' onClick={this.handleLoginClick} /> */}
              {/*<LoginButtonModal authenticate={this.props.authenticate}/> */}
              <Button as={Link} to='/login' content='Log In' />
            </Menu.Item>,
            <Menu.Item key='signup' style={{paddingLeft: '0px'}}> 
              <Button as={Link} to='/signup' primary content='Sign Up' />
            </Menu.Item>
          ])}

          {this.props.isAuthed && ([
            <Menu.Item key='create' style={{paddingLeft: '0px'}}> 
              <Button as={Link} to='/create' primary content='Create Listing' />
            </Menu.Item>,
            <Dropdown key='menu' text={this.props.user.name} className='link item' pointing>          
              <Dropdown.Menu> 
                <Dropdown.Item key='dashboard' as={Link} to='/dashboard'>Dashboard</Dropdown.Item>
                <Dropdown.Item key='profile' as={Link} to='/profile'>Profile</Dropdown.Item>
                <Dropdown.Item key='referral'>Referral</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={this.props.signoff} as={Link} to='/'>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ])}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default MainNav;