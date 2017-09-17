import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createNewTask } from '../helpers/database.js'
import Close from '../styles/images/close.js'
import { Checkbox, Label } from 'rebass'
import { Elements, CardElement, injectStripe } from 'react-stripe-elements'
import { firebaseAuth, ref } from '../constants/firebase.js'
import { TextField, ButtonGroup, Button, FormLayout } from '@shopify/polaris'

export default class Add extends Component {
  static propTypes = {}

  state = {
    deliverable: '',
    client: '',
    deadline: '',
    paid: false,
    number: '',
    cvv: '',
    month: '',
    year: '',
    hasCard: false
  }

  componentDidMount() {
    const source = ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
      .once('value')
      .then(snap => this.setState({ hasCard: true }))
  }

  handleEmailChange = e => this.setState({ client: e })
  handleDeliverableChange = e => this.setState({ deliverable: e })
  handleDeadlineChange = e => this.setState({ deadline: e })

  handleSubmit = () => {
    // const source = ref
    //   .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
    //   .once('value')
    //   .then(snap => snap.val().id)

    createNewTask(
      this.state.deliverable,
      this.state.client,
      this.state.deadline,
      Date.now(),
      null
      // source
    )
    this.props.closeAddModal()
  }

  render() {
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa3 w5 w-40-ns br3">
            <FormLayout>
              <TextField
                label="Ask"
                type="email"
                onChange={this.handleEmailChange}
                placeholder="Someone's Email Address"
                value={this.state.client}
              />

              <TextField
                label="For"
                type="text"
                onChange={this.handleDeliverableChange}
                // onChange={this.handleChange('deliverable')}
                placeholder="What You want"
                value={this.state.deliverable}
              />

              <TextField
                label="By"
                type="date"
                onChange={this.handleDeadlineChange}
                // onChange={this.handleChange('deadline')}
                value={this.state.deadline}
              />

              <ButtonGroup>
                <Button onClick={this.props.closeAddModal}>Cancel</Button>
                <Button primary onClick={this.handleSubmit}>
                  Send Realsie
                </Button>
              </ButtonGroup>
            </FormLayout>
          </div>
        </div>
      </div>
    )
  }
}

class _CardDetails extends Component {
  handleSubmit = ev => {
    ev.preventDefault()
    this.props.stripe
      .createToken()
      .then(({ token }) => {
        ref
          .child(`/users/${firebaseAuth().currentUser.uid}/sources`)
          .update({ token })
      })
      .catch(reason => console.error(reason))
  }

  // chargeUser = async () => {
  //   const source = await ref
  //     .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
  //     .once('value')
  //     .then(snap => snap.val().id)
  //
  //   ref.child(`/users/${firebaseAuth().currentUser.uid}/charges`).push({
  //     source: source,
  //     amount: 500
  //   })
  // }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="mt3">
        <CardElement style={{ base: { fontSize: '18px' } }} className="w-80" />
        <button type="submit">Verify Card</button>
      </form>
    )
  }
}

const CardDetails = injectStripe(_CardDetails)
