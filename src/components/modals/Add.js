
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createNewTask } from '../../helpers/crud.js'
// import { firebaseAuth, ref } from '../../constants/firebase.js'
import { TextField, ButtonGroup, Button, FormLayout } from '@shopify/polaris'

const CreateNewTask = ({
  closeAddModal
}) => {
  const [state, setState] = useState({
    deliverable: '',
    client: '',
    deadline: new Date().toISOString().split('T')[0],
    errors: {},
    isSubmitting: false,
    hasCard: false
  })

  // useEffect(() => ref
  //   .child(`/users/${firebaseAuth().currentUser.uid}/sources/token/card`)
  //   .once('value')
  //   .then(snap => setState({ ...state, hasCard: true })), [])

  const handleEmailChange = e =>
    setState({ ...state, client: e, errors: { ...state.errors, email: null } })

  const handleDeliverableChange = e =>
    setState({...state,
      deliverable: e,
      errors: { ...state.errors, deliverable: null }
    })

  const handleDeadlineChange = e =>
    setState({...state,
      deadline: e,
      errors: { ...state.errors, deadline: null }
    })

  const handleSubmit = () => {
    setState({ ...state, isSubmitting: true })
    const errors = validate({
      email: state.client,
      deliverable: state.deliverable,
      date: state.deadline
    })
    const anyError = Object.keys(errors).some(x => errors[x])
    if (anyError) {
      setState({ ...state, errors, isSubmitting: false })
      return
    }
    createNewTask(
      state.deliverable,
      state.client,
      state.deadline
    )
    closeAddModal()
  }

  const {errors} = state

  return (
    <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
      <div className="flex mxc cxc w-100 h-100">
        <div className="bg-white pa3 w5 w-40-ns br3 tl">
          <FormLayout>
            <TextField
              label="Ask"
              type="email"
              onChange={handleEmailChange}
              placeholder="Someone's Email Address"
              value={state.client}
              error={errors.email ? `${errors.email}` : null}
            />

            <TextField
              label="To"
              type="text"
              onChange={handleDeliverableChange}
              placeholder="What You want"
              value={state.deliverable}
              spellCheck={true}
              helpText={null}
            />

            <TextField
              label="By"
              type="date"
              onChange={handleDeadlineChange}
              value={state.deadline}
              error={
                state.deadline && errors.date ? `${errors.date}` : null
              }
            />

            {errors.base ? <p className="red">{errors.base}</p> : null}

            <ButtonGroup>
              <Button onClick={closeAddModal}>Cancel</Button>
              {state.isSubmitting ? (
                <Button disabled primary>
                    Submitting...
                </Button>
              ) : (
                <Button primary submit onClick={handleSubmit}>
                    Send Realsie to{' '}
                  {state.client ? state.client : `...`}
                </Button>
              )}
            </ButtonGroup>
          </FormLayout>
        </div>
      </div>
    </div>
  )
}

CreateNewTask.propTypes = {
  closeAddModal: PropTypes.func.isRequired
}

export default CreateNewTask

function validate (inputs) {
  return {
    email:
      inputs.email && inputs.email.indexOf('@') === -1
        ? 'Please enter a valid email.'
        : inputs.email && inputs.email.indexOf('.') === -1
          ? 'Please enter a valid email.'
          : null,

    date:
      inputs.date &&
      new Date(inputs.date).toISOString().split('T')[0] >=
        new Date().toISOString().split('T')[0]
        ? null
        : `The deadline cannot be in the past. That's not fair.`,
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
