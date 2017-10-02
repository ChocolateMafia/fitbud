import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

class LoginButtonModal extends Component {
	state = {open: false};

	handleSubmit = (event) => {
    // event.preventDefault();
		console.log(event);
    // fetch('/login')
    //   .then(response => response.text())
    //   .then(text => console.log(text));
		this.setState({submit: true});
	};

  handleModalClose = () => this.setState({open: false});
  handleModalOpen = () => this.setState({open: true});

	render(props) {
		return (
			<Modal open={this.state.open} dimmer='blurring' trigger={<Button onClick={this.handleModalOpen}>Login</Button>} 
       onClose={this.handleModalClose} size='tiny' closeIcon>
       <Modal.Header>Log In</Modal.Header>
        <Modal.Content>
          <Form action='/login' loading={this.state.submit} onSubmit={this.handleSubmit.bind(this)}>
              <Form.Input icon='user' iconPosition='left' 
                placeholder='Username or email address' 
                label='Username' type='text' />
              <Form.Input icon='lock' iconPosition='left' 
                placeholder='Password' label='Password' 
                type='password' />
              <Form.Button style={{display: 'none'}}>Log In</Form.Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.handleModalClose}>
            Nope
          </Button>
          <Button positive content="Log In" />
        </Modal.Actions>
      </Modal>
		)
	}
}

export default LoginButtonModal;