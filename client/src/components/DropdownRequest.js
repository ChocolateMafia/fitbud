import React, { Component } from 'react';
import { Card, Icon, Image, Accordion, Button } from 'semantic-ui-react';

class DropdownRequest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
    <div>
      {this.props.requests.map(request => (
        <IndividualRequest request={request} update={this.props.update} />
      ))}
    </div>
    );
  }
}

class IndividualRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    }
  }

  render() {
    if (this.props.request.status === 'pending' && !this.state.clicked) {
      return(
        <div>
          <span>
            {this.props.request.name}
          </span>
          <span>
            <Button basic color='green' size='mini' style={{margin: '10px'}}
              onClick={() => {
                this.props.update(this.props.request.userId, this.props.request.postingId);
                this.setState({clicked: !this.state.clicked})
              }} >Accept</Button>
          </span>
        </div>
      );
    } else {
      return(
        <div>
          <span style={{color: '#21ba45'}}>
            {this.props.request.name}
          </span>
          <span style={{color: '#21ba45', margin: '10px'}}>
            Accepted!
          </span>
        </div>
      )
    }
  }
}

export default DropdownRequest;
