import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

var About = () => (
  <div>
    <Segment size='huge' textAlign='center' style={{minHeight: 700, padding: '1em 0em'}} vertical>
      <Container text>
        <Header
          as='h1'
          content='FitBud'
          style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }}
        />
        <Header
          as='h2'
          content='Fitbud was a full stack project by Elena, Aileen and Kenny at Hack Reactor.
          The founders experienced a problem where they wanted a workout buddy to make exercising
          more fun and to keep themselves accountable. They created 
          Fitbud to simplify the process of finding a fitness buddy and turn exercise into an 
          engaging social experience.'
          style={{ fontSize: '1.7em', fontWeight: 'normal' }}
        />
      </Container>
    </Segment>

  </div>
)

export default About;