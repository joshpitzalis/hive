import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Close from '../../styles/images/close.js'
import { Checkbox, Label } from 'rebass'
import { firebaseAuth, ref } from '../../constants/firebase.js'
import { acceptChallenge } from '../../helpers/crud'
import {
  TextField,
  ButtonGroup,
  Button,
  FormLayout,
  DisplayText
} from '@shopify/polaris'
import StripeCheckout from 'react-stripe-checkout'
import { logo } from '../../styles/images/realsies.png'

export default class Add extends Component {
  propTypes = {
    closeAddCardModal: PropTypes.func.isRequired,
    taskId: PropTypes.string.isRequired,
    toggleCheckout: PropTypes.func.isRequired
  }

  state = {
    deliverable: '',
    client: '',
    deadline: '',
    paid: false,
    number: '',
    cvv: '',
    month: '',
    year: '',
    taskDetails: null,
    loading: false
  }

  componentDidMount() {
    ref
      .child(`/pendingTasks/${this.props.taskId}`)
      .once('value')
      .then(snap => this.setState({ taskDetails: snap.val() }))
  }

  render() {
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa4 w5 w-40-ns br3">
            {!this.state.loading && (
              <DisplayText size="extraLarge">
                {`You are committing to ${this.state.taskDetails
                  ? this.state.taskDetails.deliverable
                  : `...`} for ${this.state.taskDetails
                  ? this.state.taskDetails.client
                  : `...`} by ${this.state.taskDetails
                  ? this.state.taskDetails.deadline
                  : `...`} or be charged $10 everyday till you do.`}
              </DisplayText>
            )}
            <br />
            <br />
            <span className="w-100 flex mxa">
              {' '}
              <Button plain onClick={() => this.props.closeAddCardModal()}>
                Cancel
              </Button>
              <StripeCheckout
                name="Realsies"
                description="Put your money where your mouth is."
                email={this.state.taskDetails && this.state.taskDetails.from}
                token={token => {
                  acceptChallenge(
                    this.props.taskId,
                    this.state.taskDetails.deliverable,
                    this.state.taskDetails.client,
                    this.state.taskDetails.deadline,
                    this.state.taskDetails.createdAt,
                    this.state.taskDetails.sendersUid,
                    token
                  )
                  this.props.closeAddCardModal()
                }}
                currency={'USD'}
                stripeKey={process.env.REACT_APP_stripeKey}
                image={logo}
                panelLabel="Commit"
                label="Enter Card Details"
                opened={() => this.setState({ loading: true })}
                closed={() => this.setState({ loading: false })}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }
}
