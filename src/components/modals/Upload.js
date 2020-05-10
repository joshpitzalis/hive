/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { uploadDeliverable } from '../../helpers/crud.js'
import Close from '../../styles/images/close.js'
import Dropzone from 'react-dropzone'
import Upload from '../../styles/images/Upload.js'
import Complete from '../../styles/images/Complete.js'
import { auth, storage } from '../../constants/firebase.js'

export default class UploadDeliverable extends Component {
  state = {
    upload: null,
    errors: {},
    isSubmitting: false
  }

  handleUrl = e => {
    this.setState({
      url: e.target.value,
      errors: { ...this.state.errors, url: null }
    })
  }

  handleUpload = files => {
    const file = files[0]
    const uploadTask = storage
      .ref('/deliverables')
      .child(auth.currentUser.uid)
      .child(file.name)
      .put(file, { contentType: file.type })
    uploadTask.on('state_changed', snapshot => {
      this.setState({
        transferCurrent: snapshot.bytesTransferred,
        transferTotal: snapshot.totalBytes
      })
    })
    uploadTask
      .then(snapshot => {
        this.setState({
          upload: snapshot.downloadURL,
          errors: { ...this.state.errors, upload: null }
        })
      })
      .catch(error => console.error(error))
  }

  handleSubmit = async () => {
    this.setState({ isSubmitting: true })
    const errors = validate({
      upload: this.state.upload,
      url: this.state.url
    })
    const anyError = Object.keys(errors).some(x => errors[x])
    if (anyError) {
      this.setState({ errors, isSubmitting: false })
      return
    }

    await uploadDeliverable(
      this.state.upload,
      this.state.url,
      this.props.taskId
    )
    this.props.closeUploadModal()
  }

  render() {
    const errors = this.state.errors
    return (
      <div className="flex fixed top-0 left-0 h-100 w-100 bg-black-60 z-1">
        <div className="flex mxc cxc w-100 h-100">
          <div className="bg-white pa3 w5 w-40-ns tc">
            <div
              className="tr dim pointer"
              onClick={() => this.props.closeUploadModal()}
            >
              <Close />
            </div>

            <h1>Submit your work.</h1>
            <input
              type="url"
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80"
              placeholder="You can paste a link here..."
              value={this.state.url}
              onChange={this.handleUrl}
            />
            <Dropzone
              className="ba b--silver w5 pa3 flex col mxc h-100 pointer dim center w-80 mv3 grow"
              onDrop={this.handleUpload}
              activeStyle={{ transform: 'scale(1.05)' }}
            >
              <div className="flex mxc w-100">
                {this.state.upload ? <Complete /> : <Upload />}
              </div>
              {this.state.upload ? (
                <p>Drag another file here to replace.</p>
              ) : (
                <p>Drag files here to upload.</p>
              )}
              {this.state.transferCurrent !== 0 &&
                this.state.transferTotal && (
                  <progress
                    value={this.state.transferCurrent}
                    max={this.state.transferTotal}
                    className="w-100"
                  />
                )}
            </Dropzone>

            {errors.base ? <p className="red">{errors.base}</p> : null}
            <input
              type="submit"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 db ma4 center"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  }
}

function validate(inputs) {
  return {
    base:
      (inputs.url && inputs.url.length > 0) ||
      (inputs.upload && inputs.upload.length > 0)
        ? null
        : 'Please add atleast one field.'
  }
}
