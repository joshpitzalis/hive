import React from 'react'
import PropTypes from 'prop-types'
import { acceptChallenge, declineChallenge } from '../../helpers/crud'

import { Card, Button } from '@shopify/polaris'

const Active = ({
  title,
  due,
  toggleUploadModal,
  deliver,
  taskId,
  from,
  ready,
  createdAt
}) => {
  return (
    <Card
      title={title}
      sectioned
      secondaryFooterAction={{
        content: 'Deliver',
        onAction: () => toggleUploadModal(taskId)
      }}
    >
      <div className="flex mxc">
        <h2>
          {from || 'Someone'} asked you to do this by {due || 'sometime'}.
        </h2>
      </div>
      {ready ? (
        <div className="flex mxc cxc pt3">
          <span className="br-100 bg-black h2 w2" />
          <p data-test="activeTask" className=" pl3">
            Complete
          </p>
        </div>
      ) : (
        <div className="flex mxc cxc pt3">
          <span className="br-100 bg-green h2 w2" />
          <p data-test="activeTask" className=" pl3">
            Active
          </p>
        </div>
      )}
    </Card>
  )
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
