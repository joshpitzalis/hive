import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createNewTask} from '../helpers/database.js'

export default class Add extends Component {

  static propTypes = {}

  state = {
      deliverable: null,
      client: null,
      deadline: null
  }

  handleChange = fieldName => evt => {
      this.setState({
        [fieldName]: evt.target.value
      })
    }

  handleSubmit = () => {
    console.log('close')
    createNewTask(this.state.deliverable, this.state.client, this.state.deadline)
    console.log('done')
    // this.closeModal()
  }

  // closeModal= () => {
  //
  // }

  render() {
    return (
      <div className='flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1'>
        <div className='flex mxc cxc w-100 h-100'>
          <div className='bg-white pa3 w5 w-40-ns'>
            {/* add close button here  */}
            <h1>I will</h1>
            <input type='text' onChange={this.handleChange('deliverable')} className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80' placeholder='send something' value={this.state.deliverable} />
            <h1>to</h1>
            <input type='email' onChange={this.handleChange('client')} className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80' placeholder='someone' value={this.state.client}/>
            <h1>by</h1>
            <input type='date' onChange={this.handleChange('deadline')} className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80' value={this.state.deadline} />

            <input type='submit' className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 db ma4 center' onClick={ this.handleSubmit}/>

          </div>
        </div>
      </div>
    )
  }
}
