import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createNewTask } from '../helpers/database.js'
import Close from '../styles/images/close.js'
import { Checkbox, Label } from 'rebass'
import { Elements, CardElement, injectStripe } from 'react-stripe-elements'
import { firebaseAuth, ref } from '../constants/firebase.js'

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
    year: ''
  }

  handleChange = fieldName => evt => {
    this.setState({
      [fieldName]: evt.target.value
    })
  }

  handleSubmit = () => {
    createNewTask(
      this.state.deliverable,
      this.state.client,
      this.state.deadline,
      Date.now()
    )
    this.props.closeAddModal()
  }

  render() {
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa3 w5 w-40-ns h-75 overflow-y-auto">
            <div className="tr dim pointer" onClick={this.props.closeAddModal}>
              <Close />
            </div>
            <h1>I will...</h1>
            <input
              type="text"
              name="deliverable"
              onChange={this.handleChange('deliverable')}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              placeholder="something I promise to do"
              value={this.state.deliverable}
            />
            <h1>for...</h1>
            <input
              type="email"
              onChange={this.handleChange('client')}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              placeholder="someone's email address"
              value={this.state.client}
            />
            <h1>by...</h1>
            <input
              type="date"
              onChange={this.handleChange('deadline')}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              value={this.state.deadline}
            />

            <Label className="mt4 pa2 w-80 center">
              <Checkbox
                type="checkbox"
                name="paid"
                value={this.state.paid}
                onChange={() => this.setState({ paid: !this.state.paid })}
              />
              or I'll be charged $5 everyday that I don't.
            </Label>
            {this.state.paid &&
              <Elements>
                <CardDetails />
              </Elements>}

            <input
              type="submit"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 db ma4 center"
              onClick={this.handleSubmit}
            />
            <div id="card-errors" role="alert" />
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

  chargeUser = async () => {
    const source = await ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
      .once('value')
      .then(snap => snap.val().id)

    ref.child(`/users/${firebaseAuth().currentUser.uid}/charges`).push({
      source: source,
      amount: 500
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="mt3">
        <CardElement style={{ base: { fontSize: '18px' } }} className="w-80" />
        <button type="submit">Verify Card</button>
        <button
          className="link dim dib f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60 mv5 red"
          onClick={this.chargeUser}
        >
          charge User
        </button>
      </form>
    )
  }
}

const CardDetails = injectStripe(_CardDetails)
