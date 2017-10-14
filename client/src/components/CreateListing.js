import React, { Component } from 'react';
import { Grid, Header, Segment, Button, Transition, Label, Message } from 'semantic-ui-react';
import { Form, Input, TextArea, Select } from 'formsy-semantic-ui-react';
import _ from 'lodash';

// import { Card, Container, Icon, Image, List } from 'semantic-ui-react';

class CreateListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      submit: false,
      formData: null
    }

    this.options = _.range(1, 11).map(num => {
      return {
        key: num,
        text: num > 1 ? num + ' buddies' : num + ' buddy',
        value: num
      }
    })
  }

  componentDidMount() {
    this.setState({
      visible: true
    });
  }

  onValidSubmit = (formData) => {
    this.setState({submit: true});
    formData.date = new Date(formData.date).toISOString().slice(0, 19).replace('T', ' ');

    console.log('create postings formdata', formData);

    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    }

    fetch('/postings', options)
      .then(response => {
        if (response.ok) {
          this.props.history.replace('/listings');
        } else {
          this.setState({
            errorHeader: 'Error encountered',
            errorContent: 'Please try again',
            formError: true,
            submit: false
          })
        }
      })
  };

  render() {
    // const styles = {
    //   root: {
    //     marginTop: 18,
    //     // padding: '0 24px 24px 24px',
    //   },

    //   customErrorLabel: {
    //     color: '#f00',
    //     textAlign: 'center',
    //   },
    // };

    //const errorLabel = <Label color="red" pointing/>;

    const titleInput = (
      <Input
        name="title"
        placeholder="Title"
        type='text'
        icon="sticky note"
        iconPosition="left"
        required
        validations={{
          minLength: 8,
          maxLength: 50
        }}
        validationErrors={{
          minLength: 'Minimum of 8 characters',
          maxLength: 'Maximum of 50 characters',
          isDefaultRequiredValue: 'Title is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const locationInput = (
      <Input
        name="location"
        placeholder="Workout location"
        type='text'
        icon="map"
        iconPosition="left"
        required
        validations={{}}
        validationErrors={{
          isDefaultRequiredValue: 'Location is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const meetupInput = (
      <Input
        name="meetup_point"
        placeholder="Meeting point"
        type='text'
        icon="point"
        iconPosition="left"
        required
        validations={{}}
        validationErrors={{
          isDefaultRequiredValue: 'Meeting point is required',
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const dateInput = (
      <Input
        name="date"
        placeholder="Date MM/DD/YYYY"
        type='text'
        icon="calendar"
        iconPosition="left"
        required
        validationErrors={{
          isDefaultRequiredValue: 'Date is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const durationInput = (
      <Input
        name="duration"
        placeholder="Duration in hours"
        type='text'
        icon="clock"
        iconPosition="left"
        required
        validationErrors={{
          isDefaultRequiredValue: 'Duration is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const buddiesInput = (
      <Select
        name="buddies"
        options={ this.options }
        placeholder="Number of buddies"
        required
        errorLabel={ <Label basic color='red' pointing /> }
        validationErrors={{
          isDefaultRequiredValue: 'Buddies are required',
        }}
      />
    )

    const detailsInput = (
      <TextArea
        name="details"
        type='text'
        required
        placeholder="Details for the event"
        validations={{
          minLength: 10
        }}
        validationErrors={{
          minLength: 'Minimum of 10 characters',
          isDefaultRequiredValue: 'Details are required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
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
            }
          `}</style>
          <Grid
            textAlign='center'
            style={{ height: '100%',
                     marginTop: '3em',
                     marginBottom: '3em' }}
          >
            <Grid.Column style={{ maxWidth: 550 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Find your next buddy
                </Header>
              <Segment>
              <Form size='large'
                    error={this.state.formError}
                    noValidate
                    onValidSubmit={this.onValidSubmit}
              >
                { titleInput }
                { locationInput }
                { meetupInput }
                { dateInput }
                <Form.Group widths='equal'>
                  { durationInput }
                  { buddiesInput }
                </Form.Group>
                { detailsInput }
                <Button loading={this.state.submit} color='teal' size='large' fluid>CREATE LISTING</Button>                                                                                                                                                          
                <Message error 
                         header={this.state.errorHeader}
                         content={this.state.errorContent}
                />
              </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      </Transition>   
    )
  }
}

export default CreateListing
