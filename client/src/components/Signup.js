import React, { Component } from 'react';
import { Form, Input } from 'formsy-semantic-ui-react';
import { Grid, Header, Button, Transition, Label, Message } from 'semantic-ui-react';
//import { Link, Redirect } from 'react-router-dom';

const styles = {
  root: {
    marginTop: 18,
    // padding: '0 24px 24px 24px',
  },

  customErrorLabel: {
    color: '#f00',
    textAlign: 'center',
  },
};

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      submit: false,
      formData: null
    }

    console.log(this.props);
  }

  componentDidMount() {
    this.setState({
      visible: true
    });
  }

  onValidSubmit = (formData) => {
    this.setState({submit: true});

    console.log(formData);

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    }

    fetch('/register', options)
      .then(response => {
        if (response.ok) {
          this.props.history.replace('/login');
        } else {
          this.setState({
            errorHeader: 'User already exists',
            errorContent: 'Please login instead',
            formError: true,
            submit: false
          })
        }
      })
  };

  render() {
    //const errorLabel = <Label color="red" pointing/>;

    const nameInput = (
      <Input
        name="name"
        placeholder="Full name"
        type='text'
        icon="id card outline"
        iconPosition="left"
        required
        validations={{
          isWords: true
        }}
        validationErrors={{
          isDefaultRequiredValue: 'Name is required',
          isWords: 'Only alphabetical characters allowed'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const emailInput = (
      <Input
        ref={input => this.inputRef = input}
        autoFocus
        name="username"
        placeholder="E-mail"
        icon="mail"
        iconPosition="left"
        required
        validations="isEmail"
        validationErrors={{
          isEmail: 'Invalid email format',
          isDefaultRequiredValue: 'Email is Required',
        }}
        errorLabel={ <Label basic color='red' pointing /> }
        rootStyle={ styles.formElement }
      />
    );

    const passwordInput = (
      <Input
        name="password"
        placeholder="Password"
        type='password'
        icon="lock"
        iconPosition="left"
        required
        validations="minLength:8"
        validationErrors={{
          minLength: 'Minimum of 8 characters',
          isDefaultRequiredValue: 'Password is Required',
        }}
        errorLabel={ <Label basic color='red' pointing /> }
        rootStyle={ styles.formElement }
      />
    );

    const passwordConfirmInput = (
      <Input
        instantValidation
        name="passwordConfirm"
        placeholder="Confirm password"
        type='password'
        icon="lock"
        iconPosition="left"
        required
        validations={{
          minLength: 8,
          equalsField: 'password'
        }}
        validationErrors={{
          minLength: 'Minimum of 8 characters',
          isDefaultRequiredValue: 'Password is Required',
          equalsField: 'Passwords do not match'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
        rootStyle={ styles.formElement }
      />
    );

    return (
      <Transition visible={this.state.visible} animation='fade' duration={1000}>
        <div className='login-form'>
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 90%;
            };

          `}</style>
          <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
          >
            <Grid.Column style={{ maxWidth: 500 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Signup today!
              </Header>
              <Form size='large'
                    error={this.state.formError}
                    noValidate
                    onValidSubmit={this.onValidSubmit}
              >
                { nameInput }
                { emailInput }
                <Form.Group widths='equal'>
                  { passwordInput }
                  { passwordConfirmInput }
                </Form.Group>
                <Button loading={this.state.submit} color='teal' size='large' fluid>CREATE AN ACCOUNT</Button>
                <Message error 
                         header={this.state.errorHeader}
                         content={this.state.errorContent}
                />
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </Transition>
    )
  }
}

export default Signup;