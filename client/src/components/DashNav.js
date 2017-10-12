import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class DashNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu tabular>
        <Menu.Item name='my workouts' active={this.props.view === 'my workouts'} onClick={this.props.handleClick} />
        <Menu.Item name='my requests' active={this.props.view === 'my requests'} onClick={this.props.handleClick} />
        <Menu.Item name='upcoming workouts' active={this.props.view === 'upcoming workouts'} onClick={this.props.handleClick} />
        <Menu.Item name='events' active={this.props.view === 'events'} onClick={this.props.handleClick} />
      </Menu>
    )
  }

}

export default DashNav;
