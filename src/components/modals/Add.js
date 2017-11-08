import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createNewTask } from '../../helpers/crud.js'
import Close from '../../styles/images/close.js'
import { Checkbox, Label } from 'rebass'
import { firebaseAuth, ref } from '../../constants/firebase.js'
import { TextField, ButtonGroup, Button, FormLayout } from '@shopify/polaris'

export default class Add extends Component {
  state = {
    deliverable: '',
    client: '',
    deadline: '',
    errors: {},
    isSubmitting: false
  }

  componentDidMount() {
    const source = ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
      .once('value')
      .then(snap => this.setState({ hasCard: true }))
  }

  handleEmailChange = e =>
    this.setState({ client: e, errors: { ...this.state.errors, email: null } })
  handleDeliverableChange = e =>
    this.setState({
      deliverable: e,
      errors: { ...this.state.errors, deliverable: null }
    })
  handleDeadlineChange = e =>
    this.setState({
      deadline: e,
      errors: { ...this.state.errors, deadline: null }
    })

  handleSubmit = () => {
    this.setState({ isSubmitting: true })
    const errors = validate({
      email: this.state.client,
      deliverable: this.state.deliverable,
      date: this.state.deadline
    })
    const anyError = Object.keys(errors).some(x => errors[x])
    if (anyError) {
      this.setState({ errors, isSubmitting: false })
      return
    }
    createNewTask(
      this.state.deliverable,
      this.state.client,
      this.state.deadline
    )
    this.props.closeAddModal()
  }

  render() {
    const errors = this.state.errors
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa3 w5 w-40-ns br3 tl">
            <FormLayout>
              <TextField
                label="Ask"
                type="email"
                onChange={this.handleEmailChange}
                placeholder="Someone's Email Address"
                value={this.state.client}
                error={errors.email ? `${errors.email}` : null}
              />

              <TextField
                label="To"
                type="text"
                onChange={this.handleDeliverableChange}
                placeholder="What You want"
                value={this.state.deliverable}
                spellCheck={true}
                helpText={null}
              />

              <TextField
                label="By"
                type="date"
                onChange={this.handleDeadlineChange}
                value={this.state.deadline}
                error={
                  this.state.deadline && errors.date ? `${errors.date}` : null
                }
              />

              {errors.base ? <p className="red">{errors.base}</p> : null}

              <ButtonGroup>
                <Button onClick={this.props.closeAddModal}>Cancel</Button>
                {this.state.isSubmitting ? (
                  <Button disabled primary>
                    Submitting...
                  </Button>
                ) : (
                  <Button primary onClick={this.handleSubmit}>
                    Send Realsie to{' '}
                    {this.state.client ? this.state.client : `...`}
                  </Button>
                )}
              </ButtonGroup>
            </FormLayout>
          </div>
        </div>
      </div>
    )
  }
}

function validate(inputs) {
  return {
    email:
      inputs.email && inputs.email.indexOf('@') === -1
        ? 'Please enter a valid email.'
        : inputs.email && inputs.email.indexOf('.') === -1
          ? 'Please enter a valid email.'
          : null,

    date:
      inputs.date && new Date(inputs.date) > new Date()
        ? null
        : 'The deadline cannot be in the past. That would be unfair.',
    base:
      inputs.date &&
      inputs.date.length > 0 &&
      inputs.email &&
      inputs.email.length > 0 &&
      inputs.deliverable &&
      inputs.deliverable.length > 0
        ? null
        : 'Please fill out all the fields.'
  }
}
