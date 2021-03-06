import React, { Component } from 'react';
import { Form} from 'formsy-semantic-ui-react';
import { Container, Image, List, Grid, Header, Segment, Message, Label } from 'semantic-ui-react';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: false,
      submit: false,
      formData: null
    };

    this.onValidSubmit = this.onValidSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      visible: true
    });
  }  

  onValidSubmit (formData) {
    console.log(formData);

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    };

    fetch('/profile', options)
      .then(response => {
        if (response.ok) {
          this.setState({
            successHeader: 'Profile Update Success',
            formSuccess: true,
            formError: null,            
            submit: false
          });
          this.props.handleProfileUpdate();
        } else {
          this.setState({
            errorHeader: 'Profile Update Failed',
            errorContent: 'Please Contact Customer Service',
            formError: true,
            formSuccess: null,            
            submit: false
          });
        }
      });
  }

  render() {
    var images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
    var userPic = '/' + images[Math.floor(Math.random() * images.length)];
    userPic = (this.props.user && this.props.user.picture) ? this.props.user.picture : userPic;

    const errorLabel = <Label color="red" pointing/>;

    const options = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ];

    return (
      <Container style={{margin: '20px'}}>

        <Container style={{margin: '30px'}}>
          <Image src={userPic} size='small' shape='circular' centered style={{margin: 'auto'}} />
          <Container style={{'textAlign': 'center'}}>
            <List style={{margin: '10px'}}>
              <List.Item>
                <List.Header>My Profile</List.Header>
              </List.Item>
            </List>
          </Container>
        </Container>

        <Container style={{margin: '30px'}}>
          <Grid
            textAlign='center'
            style={{ 
              height: '100%',
              marginTop: '3em',
              marginBottom: '3em' }}
          >
            <Grid.Column style={{ maxWidth: 1000 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Update Your Profile
              </Header>
              <Segment textAlign='left'>
                <Form
                  size='large'
                  error={this.state.formError}
                  success={this.state.formSuccess}
                  noValidate
                  onValidSubmit={this.onValidSubmit}
                >         
                  <Form.Input 
                    label='Name'
                    name='name'
                    placeholder={this.props.user.name}
                    type='text'
                    labelPosition='left'
                    icon="id card outline"
                    iconPosition="left"  
                    validations={{
                      isWords: true
                    }}
                    validationErrors={{
                      isWords: 'Only letters allowed for name'
                    }}
                    errorLabel={ errorLabel }                     
                  />

                  <Form.Input 
                    label='Email (Username)'
                    name='username'
                    placeholder={this.props.user.email}
                    type='text'
                    labelPosition='left'
                    icon="mail"
                    iconPosition="left"  
                    validations="isEmail"
                    validationErrors={{
                      isEmail: 'Invalid email format'
                    }}
                    errorLabel={ errorLabel }                     
                  />

                  <Form.Group widths='equal'>
                    <Form.Input
                      label='New Password'
                      name="password"
                      placeholder="Password"
                      type='password'
                      icon="lock"
                      iconPosition="left"
                      validations="minLength:8"
                      validationErrors={{
                        minLength: 'Minimum of 8 characters',
                      }}
                      errorLabel={ errorLabel }
                    />
                    <Form.Input
                      label='Confirm New Password'
                      name="passwordConfirm"
                      placeholder="Password"
                      type='password'
                      icon="lock"
                      iconPosition="left"
                      validations={{
                        minLength: 8,
                        equalsField: 'password'
                      }}
                      validationErrors={{
                        minLength: 'Minimum of 8 characters',
                        equalsField: 'Passwords do not match'
                      }}
                      errorLabel={ errorLabel }
                    />                                  
                  </Form.Group>

                  <Form.Group widths='equal'>
                    <Form.Input 
                      label='Age'
                      name='age'
                      placeholder={this.props.user.age}
                      type='text'
                      labelPosition='left'
                      icon="info"
                      iconPosition="left"  
                      validations="isNumeric"
                      validationErrors={{
                        isEmail: 'Age must be a number'
                      }}
                      errorLabel={ errorLabel }                     
                    />

                    <Form.Select 
                      label='Gender'
                      name='gender'
                      placeholder='Gender'
                      options={options} 
                    />
                  </Form.Group>
                
                  <Form.Button
                    loading={this.state.submit}
                    color='teal'
                    size='large'
                    fluid
                  >
                    Submit
                  </Form.Button>

                  <Message 
                    error 
                    header={this.state.errorHeader}
                    content={this.state.errorContent}
                  />

                  <Message 
                    success 
                    header={this.state.successHeader}
                    content={this.state.successContent}
                  />
              
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>

      </Container>

    );
  }
}
//<Button loading={this.state.submit} color='teal' size='large' fluid>CREATE LISTING</Button>                                                                                                                                                          

export default Profile;
