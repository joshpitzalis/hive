import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createNewTask } from '../helpers/database.js'
import Close from '../styles/images/close.js'
import { Checkbox, Label } from 'rebass'
import { CardElement } from 'react-stripe-elements'

export default class Add extends Component {
  static propTypes = {}

  state = {
    deliverable: null,
    client: null,
    deadline: null,
    paid: false,
    number: null,
    cvv: null,
    month: null,
    year: null
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
            <h1>I will send</h1>
            <input
              type="text"
              name="deliverable"
              onChange={this.handleChange('deliverable')}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              placeholder="something I promise to do"
              value={this.state.deliverable}
            />
            <h1>to</h1>
            <input
              type="email"
              onChange={this.handleChange('client')}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              placeholder="someone's email address"
              value={this.state.client}
            />
            <h1>by</h1>
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
            {this.state.paid && <Checkout />}
            <label>
              Card details
              <CardElement style={{ base: { fontSize: '18px' } }} />
            </label>
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

const Checkout = ({ props }) =>
  <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
    <legend className="ph0 mh0 fw6 clip">Add Your Payment Details</legend>
    <div className="mt3">
      <label className="db fw4 lh-copy f6" for="email-address">
        Card Number
      </label>
      <input
        className="pa2 input-reset ba bg-transparent w-80 measure"
        type="number"
        name="email-address"
        id="email-address"
      />
    </div>
    <div className="mt3">
      <label className="db fw4 lh-copy f6" for="password">
        CVV
      </label>
      <input
        className="b pa2 input-reset ba bg-transparent"
        type="number"
        name="password"
        id="password"
      />
    </div>
    <div className="mt3">
      <label className="db fw4 lh-copy f6" for="Expiry">
        Expiry Date
      </label>
      <div className="tc">
        <input
          className="b pa2 input-reset ba bg-transparent w3"
          type="number"
          name="Expiry"
          id="month"
        />
        <input
          className="b pa2 input-reset ba bg-transparent w4"
          type="number"
          name="Expiry"
          id="year"
        />
      </div>
    </div>
  </fieldset>
