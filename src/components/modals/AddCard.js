import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Close from '../../styles/images/close.js';
import { Checkbox, Label } from 'rebass';
import { Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { firebaseAuth, ref } from '../../constants/firebase.js';
import { acceptChallenge, createNewTask } from '../../helpers/crud';
import {
  TextField,
  ButtonGroup,
  Button,
  FormLayout,
  DisplayText
} from '@shopify/polaris';

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliverable: '',
      client: '',
      deadline: '',
      paid: false,
      number: '',
      cvv: '',
      month: '',
      year: '',
      // hasCard: false,
      taskDetails: null
    };
  }

  componentDidMount() {
    ref
      .child(`/pendingTasks/${this.props.taskId}`)
      .once('value')
      .then(snap => this.setState({ taskDetails: snap.val() }));
    // const source = ref
    //   .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
    //   .once('value')
    //   .then(snap => this.setState({ hasCard: true }));
  }

  handleEmailChange = e => this.setState({ client: e });
  handleDeliverableChange = e => this.setState({ deliverable: e });
  handleDeadlineChange = e => this.setState({ deadline: e });

  // handleSubmit = () => {
  //   // const source = ref
  //   //   .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
  //   //   .once('value')
  //   //   .then(snap => snap.val().id);
  //
  //   // createNewTask(
  //   //   this.state.deliverable,
  //   //   this.state.client,
  //   //   this.state.deadline
  //   // );
  //   this.props.closeAddModal();
  // };

  render() {
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa4 w5 w-40-ns br3">
            <DisplayText size="extraLarge">
              {`Commit to ${this.state.taskDetails
                ? this.state.taskDetails.deliverable
                : `...`} for ${this.state.taskDetails
                ? this.state.taskDetails.client
                : `...`} by ${this.state.taskDetails
                ? this.state.taskDetails.deadline
                : `...`} or be charged $10 everyday till you do.`}
            </DisplayText>
            <br />
            <br />
            <Elements>
              <CardDetails
                closeAddCardModal={this.props.closeAddCardModal}
                taskDetails={this.state.taskDetails}
              />
            </Elements>
          </div>
        </div>
      </div>
    );
  }
}

class _CardDetails extends Component {
  state = {
    error: null
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ error: 'Verifying...' });

    this.props.stripe.createToken().then(result => {
      if (result.error) {
        this.setState({ error: result.error.message });
      } else {
        const activeTask = acceptChallenge(
          this.props.taskDetails.taskId,
          this.props.taskDetails.deliverable,
          this.props.taskDetails.client,
          this.props.taskDetails.deadline,
          this.props.taskDetails.createdAt,
          this.props.taskDetails.sendersUid,
          result.token
        );
        this.props.closeAddCardModal();
      }
    });
  };

  render() {
    return (
      <FormLayout>
        <CardElement className="w-80" />
        <br />
        {this.state.error && <p className="red">{this.state.error}</p>}
        <ButtonGroup>
          <Button onClick={this.props.closeAddCardModal}>Cancel</Button>
          <Button primary onClick={this.handleSubmit}>
            Verify Card
          </Button>
        </ButtonGroup>
      </FormLayout>
    );
  }
}

const CardDetails = injectStripe(_CardDetails);
