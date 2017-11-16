import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { acceptChallenge, declineChallenge } from '../../helpers/crud'
import { firebaseAuth, ref } from '../../constants/firebase.js'
import { Card, Button } from '@shopify/polaris'

class Active extends Component {
  handleArchive = taskId => {
    ref
      .child(`users/${firebaseAuth().currentUser.uid}/active/${taskId}`)
      .update({ archived: true })
      .catch(error => console.error(error))
  }
  render() {
    const today = new Date().toISOString()

    if (this.props.archived) {
      return null
    }
    return (
      <Card
        title={this.props.title}
        sectioned
        // secondaryFooterAction={{
        //   content: 'Deliver',
        //   onAction: () => toggleUploadModal(taskId)
        // }}
      >
        <div className="flex mxc">
          <h2>
            {this.props.from || 'Someone'} asked you to do this by{' '}
            {this.props.due || 'sometime'}.
          </h2>
        </div>
        {this.props.ready ? (
          <div className="flex col mxc cxc pt3">
            <span className="br-100 bg-black h2 w2" />
            <p data-test="completeTask">Complete</p>
            <p
              className="f5 underline pointer"
              onClick={() => this.handleArchive(this.props.taskId)}
            >
              Archive
            </p>
          </div>
        ) : (
          <div className="flex col mxc cxc pt3">
            {this.props.due <= today ? (
              <span className="br-100 bg-red h2 w2" />
            ) : (
              <span className="br-100 bg-green h2 w2" />
            )}
            <p data-test="activeTask">Active</p>
            <p
              className="f5 underline pointer"
              onClick={() => this.props.toggleUploadModal(this.props.taskId)}
            >
              Deliver
            </p>
          </div>
        )}
      </Card>
    )
  }
}

Active.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
}
Active.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
}

export default Active
